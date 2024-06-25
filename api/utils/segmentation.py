import warnings
import numpy as np
import pandas as pd
import random
import os
import torch
import json
from io import StringIO
import chardet
import csv
import python_avatars as pa
import matplotlib.pyplot as plt
import seaborn as sns
import matplotlib.colors as mcolors
import random
from json_repair import repair_json
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import (
    silhouette_score,
    davies_bouldin_score,
    calinski_harabasz_score,
)

from torchmetrics.clustering import DunnIndex

warnings.filterwarnings("ignore")

from langchain import PromptTemplate
from langchain.output_parsers import StructuredOutputParser
import google.generativeai as genai
from dotenv import load_dotenv

def initialize():
    load_dotenv()

    API_KEY = os.getenv("API_KEY")

    if not API_KEY:
        raise ValueError("Missing OPENAI_API_KEY in .env file")

    genai.configure(api_key=os.environ["API_KEY"])
    global model
    model = genai.GenerativeModel('gemini-1.5-flash', generation_config={"response_mime_type": "application/json"})

def detect_encoding_from_content(file_content, n_bytes=10000):
    """Detect encoding from file content using chardet."""

    raw_data = file_content[:n_bytes]  
    result = chardet.detect(raw_data)
    return result['encoding']

def detect_delimiter_from_content(file_content, encoding, n_lines=20):
    """Detect the delimiter from file content using csv.Sniffer."""
    
    decoded_content = file_content.decode(encoding)
    sample_lines = ''.join(decoded_content.splitlines(True)[:n_lines])
    sniffer = csv.Sniffer()
    delimiter = sniffer.sniff(sample_lines).delimiter
    return delimiter

def read_csv_from_content(file_content):
    """Read a CSV file from content with automatic detection of encoding and delimiter."""
    
    encoding = detect_encoding_from_content(file_content)
    delimiter = detect_delimiter_from_content(file_content, encoding)
    
    decoded_content = file_content.decode(encoding)
    df = pd.read_csv(StringIO(decoded_content), delimiter=delimiter)
    return df

def clean_data(dframe):
    """
    Cleans the DataFrame by handling missing values, dropping columns with constant values,
    and label encoding categorical columns.

    Parameters:
    - dframe: Original DataFrame
    - is_labeled: Boolean indicating whether the DataFrame is labeled or unlabeled

    Returns:
    - Cleaned DataFrame
    """
    df = dframe.copy()

    # Fill missing values with mean for numeric columns
    for column in df.columns:
        if df[column].dtype != object:
            df[column] = df[column].fillna(df[column].mean())

    # Drop columns with constant values
    columns_to_drop = [col for col in df.columns if len(df[col].unique()) == 1]
    df.drop(columns=columns_to_drop, inplace=True)

    # Drop the first column - ID
    df.drop(df.columns[0], axis=1, inplace=True)

    # Label encode text label columns
    for column_name in df.columns:
        if df[column_name].dtype == object:
            df[column_name] = LabelEncoder().fit_transform(df[column_name])

    return df

def normalize_columns(dframe):
    """
    Normalizes specified columns using StandardScaler.

    Parameters:
    - df: Original DataFrame
    - list_of_columns: List of columns to normalize

    Returns:
    - DataFrame with normalized columns
    """
    df = dframe.copy()
    scaler = StandardScaler()
    df = scaler.fit_transform(df)

    return df

def k_means(raw_data, df_selected):
    best_score = -np.inf
    best_clustering_metrics = {}
    best_cluster_labels = None

    metrics = {
        "Silhouette Score": [],
        "Calinski-Harabasz Index": [],
        "Davies-Bouldin Index": [],
        "Dunn Index": [],
    }

    for k in range(2, 5):
        kmeans = KMeans(
            n_clusters=k,
            n_init=20,
            init='k-means++',
            random_state=1234,
        )

        cluster_labels = kmeans.fit_predict(df_selected)
    
        sil_score = silhouette_score(df_selected, cluster_labels)
        ch_score = calinski_harabasz_score(df_selected, cluster_labels)
        db_score = davies_bouldin_score(df_selected, cluster_labels)
        dunn_index = DunnIndex(p=2)
        dunn_score = dunn_index(torch.tensor(df_selected), torch.tensor(cluster_labels))
    
        metrics["Silhouette Score"].append((k, sil_score))
        metrics["Calinski-Harabasz Index"].append((k, ch_score))
        metrics["Davies-Bouldin Index"].append((k, db_score))
        metrics["Dunn Index"].append((k, dunn_score))
        
        if sil_score > best_score:
            best_score = sil_score
            best_clustering_metrics = {
                "Silhouette Score": sil_score,
                "Calinski-Harabasz Index": ch_score,
                "Davies-Bouldin Index": db_score,
                "Dunn Index": dunn_score
            }
            best_cluster_labels = cluster_labels

    normalized_metrics = {
        "Silhouette Score": np.array([x[1] for x in metrics["Silhouette Score"]]),
        "Calinski-Harabasz Index": np.array([x[1] for x in metrics["Calinski-Harabasz Index"]]),
        "Davies-Bouldin Index": np.array([x[1] for x in metrics["Davies-Bouldin Index"]]),
        "Dunn Index": np.array([x[1] for x in metrics["Dunn Index"]]),
    }

    for key in normalized_metrics:
        normalized_metrics[key] = (normalized_metrics[key] - np.min(normalized_metrics[key])) / (np.max(normalized_metrics[key]) - np.min(normalized_metrics[key]))

    combined_scores = (
        normalized_metrics["Silhouette Score"] +
        normalized_metrics["Calinski-Harabasz Index"] +
        (1 - normalized_metrics["Davies-Bouldin Index"]) + 
        normalized_metrics["Dunn Index"]
    )

    best_combination_index = np.argmax(combined_scores)

    best_clustering_metrics = {
        "Silhouette Score": metrics["Silhouette Score"][best_combination_index][1],
        "Calinski-Harabasz Index": metrics["Calinski-Harabasz Index"][best_combination_index][1],
        "Davies-Bouldin Index": metrics["Davies-Bouldin Index"][best_combination_index][1],
        "Dunn Index": metrics["Dunn Index"][best_combination_index][1],
    }
    print(best_clustering_metrics)

    threshold_silhouette = 0.5
    threshold_dbi = 1.0
    threshold_ch = 200.0
    dunn_index_threshold = 0.5

    quality_check_passed = all([
        best_clustering_metrics["Silhouette Score"] > threshold_silhouette,
        best_clustering_metrics["Davies-Bouldin Index"] < threshold_dbi,
        best_clustering_metrics["Calinski-Harabasz Index"] > threshold_ch,
        best_clustering_metrics["Dunn Index"] > dunn_index_threshold
    ])

    if quality_check_passed:
        print("Clustering quality meets the thresholds.")
    else:
        print("Clustering quality does not meet the thresholds.")

    raw_data['label'] = best_cluster_labels
    raw_data.to_csv('./data/labeled_data.csv', index=False)

def process_and_visualize_labeled_data(file_path, colors):
    """
    Process and visualize labeled data from a CSV file.

    Parameters:
    - file_path: Path to the CSV file containing labeled data.
    - colors: List of colors for the plot.

    Returns:
    - df_res: DataFrame with group sizes.
    - df_plot: DataFrame sorted by label.
    - Plot saved as 'group_count_plot.png' in the './assets/' folder.
    """
    df = pd.read_csv(file_path)

    # Calculate group sizes
    df_res = round(df['label'].value_counts(normalize=True), 2).rename_axis('group').to_frame('group_size').sort_index()

    # Sort the data by labels
    df_plot = df.sort_values(by='label').reset_index(drop=True)

    # Plot the data
    plt.figure(figsize=(10, 6))
    sns.countplot(x=df_plot["label"], palette=colors)
    plt.xlabel('Group', fontsize=12)
    plt.ylabel('Number of Customers in the Group', fontsize=12)
    plt.title('Customer Group Distribution')
    
    save_dir = '../frontend/public/assets/'
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)

    plt.savefig(save_dir + 'group_count_plot.png')
    plt.close()

    return df_res, df_plot

def analyze_summary_dynamic(df, label_column='label', output_file='./data/summary_result.csv'):
    """
    Performs statistical analysis on all columns (except the label column) grouped by clusters.

    Args:
        df (pd.DataFrame): The input DataFrame.
        label_column (str): The column name for cluster labels. Default is 'label'.
        output_file (str): Path to save the summary CSV file. Default is './data/summary_result.csv'.

    Returns:
        pd.DataFrame: A DataFrame containing the summary results.
    """
    
    # Exclude the label column from analysis
    cols_to_analyze = df.columns[df.columns != label_column]

    # Initialize the result DataFrame with group sizes
    df_res = round(df[label_column].value_counts(normalize=True), 2).rename_axis('group').to_frame('group_size').sort_index()

    # Calculate quartiles and ranks for each column based on its type
    for col in cols_to_analyze:
        if pd.api.types.is_numeric_dtype(df[col]):
            df_res[f"{col}_q1"] = df.groupby(label_column)[col].quantile(0.25).to_list()
            df_res[f"{col}_q3"] = df.groupby(label_column)[col].quantile(0.75).to_list()
            df_res[f"{col}_rank_q1"] = df_res[f"{col}_q1"].rank(method='max', ascending=False).astype(int).to_list()
            df_res[f"{col}_rank_q3"] = df_res[f"{col}_q3"].rank(method='max', ascending=False).astype(int).to_list()
        elif pd.api.types.is_bool_dtype(df[col]):
            df_res[f"{col}_mean"] = df.groupby(label_column)[col].mean().round(2).to_list()
        elif pd.api.types.is_categorical_dtype(df[col]) or pd.api.types.is_object_dtype(df[col]):
            # For categorical or object types, calculate mode (most frequent value)
            df_res[f"{col}_mode"] = df.groupby(label_column)[col].agg(lambda x: x.mode().iloc[0] if not x.mode().empty else None).to_list()

    # Save the result to a CSV file
    df_res.to_csv(output_file)

    return df_res

def generate_avatar(gender):
    female_hair_type = [pa.HairType.STRAIGHT_STRAND, pa.HairType.BOB, pa.HairType.LONG_NOT_TOO_LONG,
                        pa.HairType.BRIDE, pa.HairType.CURLY_2, pa.HairType.MIA_WALLACE,
                        pa.HairType.STRAIGHT_1, pa.HairType.STRAIGHT_2]
    male_hair_type = [pa.HairType.SHAGGY, pa.HairType.SHORT_FLAT, pa.HairType.CAESAR,
                      pa.HairType.CAESAR_SIDE_PART, pa.HairType.SHORT_WAVED, pa.HairType.POMPADOUR,
                      pa.HairType.ELVIS, pa.HairType.BUZZCUT]
    clothing_color = ["#E5CB93", "#A9DBEA", "#DBD2F4", "#FF8B71", "#878ECD", "#046582",
                      "#DAD8D7", "#DAD8D7", "#C0D8C0", "#DD4A48", "#FEA82F", "#FF6701"]
    clothing_style = [pa.ClothingType.SHIRT_SCOOP_NECK, pa.ClothingType.BLAZER_SWEATER,
                      pa.ClothingType.COLLAR_SWEATER, pa.ClothingType.HOODIE,
                      pa.ClothingType.SHIRT_CREW_NECK]
    hair_color = ["#6B3307", "#000000", "#C4942D", "#B05A08", "#3F4E4F", "#A27B5C",
                  "#A19882", "#555555", "#7F7C82", "#FEA82F"]

    if gender == 'Female':
        my_avatar = pa.Avatar(
            style=pa.AvatarStyle.CIRCLE,
            background_color="#F4F9F9",
            top=random.choice(female_hair_type),
            eyebrows=pa.EyebrowType.DEFAULT_NATURAL,
            eyes=pa.EyeType.DEFAULT,
            nose=pa.NoseType.DEFAULT,
            mouth=pa.MouthType.SMILE,
            facial_hair=pa.FacialHairType.NONE,
            skin_color="#FBD9BF",
            hair_color=random.choice(hair_color),
            accessory=pa.AccessoryType.NONE,
            clothing=random.choice(clothing_style),
            clothing_color=random.choice(clothing_color)
        )
    else:
        my_avatar = pa.Avatar(
            style=pa.AvatarStyle.CIRCLE,
            background_color="#F4F9F9",
            top=random.choice(male_hair_type),
            eyebrows=pa.EyebrowType.DEFAULT_NATURAL,
            eyes=pa.EyeType.DEFAULT,
            nose=pa.NoseType.DEFAULT,
            mouth=pa.MouthType.SMILE,
            facial_hair=pa.FacialHairType.NONE,
            skin_color="#FBD9BF",
            hair_color=random.choice(hair_color),
            accessory=pa.AccessoryType.NONE,
            clothing=random.choice(clothing_style),
            clothing_color=random.choice(clothing_color)
        )

    image_svg = my_avatar.render()
    image_svg = image_svg.replace("264px", "100%")
    image_svg = image_svg.replace("280px", "100%")

    return image_svg

def generate_persona(summary: dict) -> dict:
    """Generates a customer persona based on input summary.

    Args:
        summary (dict): Summary dictionary containing demographic, interest, and behavior information.

    Returns:
        dict: A dictionary containing the generated customer persona.
    """

    persona_schema = {
        "name": "response",
        "description": """{
            "cluster_summaries": [],
            "cluster_personas": []
        }"""
    }

    response_schema = [persona_schema]
    output_parser = StructuredOutputParser.from_response_schemas(response_schema)
    format_instructions = output_parser.get_format_instructions()

    prompt_template = """
    Can you analyze the provided summary data and generate a JSON object containing the following information:

    1. cluster_summaries: An array containing textual summaries for each cluster group. Make sure to not add cluster or group numbers. just add 3 key insights (IMPORTANT: ADD 3 key insights separated by "*") about the customer segment. The summary should be descriptive enough to be understood by a human.
    2. cluster_personas: An array containing detailed customer personas for each cluster group, defined by the summary information. Each persona should include:
        - Demographics (name, age, gender, marital status, family structure, income level, location, occupation)
        - Psychographics (values and beliefs, interests and hobbies, lifestyle choices)
        - Needs and pain points (needs, pain points)
        - Behavioral data (behavioral drivers, obstacles to purchasing, expectations, marketing suggestions)

    IMPORTANT: Provide cluster_personas and cluster_summaries of each cluster group and not just 2. 
    Example output (JSON):
    {{
        "cluster_summaries": [
            "Key insight 1 - Key insight 2",
            "Key insight 1 - Key insight 2",
            "Key insight 1 - Key insight 2"
        ],
        "cluster_personas": [
            {{
                "customer_persona": "Anna",
                "demographics": {{
                    "name": "Anna",
                    "age": "age_value",
                    "gender": "gender_value",
                    "marital_status": "marital_status_value",
                    "family_structure": "family_structure_value",
                    "income_level": "income_level_value",
                    "location": "location_value",
                    "occupation": "occupation_value"
                }},
                "psychographics": {{
                    "values_and_beliefs": "values_and_beliefs_value",
                    "interests_and_hobbies": "interests_and_hobbies_value",
                    "lifestyle_choices": "lifestyle_choices_value",
                    "technology_usage": "technology_usage_value",
                    "brand_preferences": "brand_preferences_value",
                    "community_engagement": "community_engagement",
                    "health_and_wellness": "health_and_wellness_value",
                    "family_dynamics": "family_dynamics_value",
                    "financial_goals": "financial_goals_value",
                    "media_consumption": "media_consumption_value",
                    "environmental_consciousness": "environmental_consciousness_value",
                    "cultural_influences": "cultural_influences_value",
                }},
                "needs_and_pain_points": {{
                    "needs": "needs_value",
                    "pain_points": "pain_points_value"
                }},
                "behavioral_data": {{
                    "behavioral_drivers": "behavioral_drivers_value",
                    "obstacles_to_purchasing": "obstacles_to_purchasing_value",
                    "expectations": "expectations_value",
                    "marketing_suggestions": "marketing_suggestions_value"
                }}
            }}
        ]
    }}

    Summary:
    {summary}

    {format_instructions}
    """

    prompt = PromptTemplate(
        input_variables=["summary"],
        template=prompt_template,
        partial_variables={"format_instructions": format_instructions},
    )

    response = model.generate_content(prompt.format(summary=json.dumps(summary)))
    output = ""
    for chunk in response:
        output += chunk.text

    try:
        output = repair_json(output)
        personas = json.loads(output)
    except json.JSONDecodeError as e:
        raise ValueError(f"Generated content is not valid JSON: {e}")
    
    if "response" in personas:
        for persona in personas["response"].get("cluster_personas", []):
            gender = persona.get("demographics", {}).get("gender", "string")
            avatar_url = generate_avatar(gender)
            persona["avatar"] = avatar_url
    elif "cluster_personas" in personas:
        for persona in personas["cluster_personas"]:
            gender = persona.get("demographics", {}).get("gender", "string")
            avatar_url = generate_avatar(gender)
            persona["avatar"] = avatar_url
            
    return personas

def generate_visualizations(combined_dict: dict) -> dict:
    """Generates visualizations based on col_names data."""

    visualizations_schema = {
        "name": "response",
        "description": """{
            "dashboard_title": "Customer Analysis Dashboard",
            "rows": [
                {
                    "row_type": "cards",
                    "items": [
                        {
                            "title": "string",
                            "col_name": "string",
                            "function": "sum/avg/max/min"
                        }
                    ]
                },
                {
                    "row_type": "charts",
                    "charts": [
                        {
                            "title": "string",
                            "type": "line/bar/pie/scatter",
                            "x_axis_column": "string",
                            "y_axis_column": "string"
                        },
                        {
                            "title": "string",
                            "type": "line/bar/pie/scatter",
                            "x_axis_column": "string",
                            "y_axis_column": "string"
                        },
                        {
                            "title": "string",
                            "type": "line/bar/pie/scatter",
                            "x_axis_column": "string",
                            "y_axis_column": "string"
                        },
                        {
                            "title": "string",
                            "type": "line/bar/pie/scatter",
                            "x_axis_column": "string",
                            "y_axis_column": "string"
                        }
                    ]
                }
            ]
        }"""
    }

    response_schema = [visualizations_schema]
    output_parser = StructuredOutputParser.from_response_schemas(response_schema)
    format_instructions = output_parser.get_format_instructions()

    prompt_template = """
    I have provided column names and summary of clustering results of my dataset. Generate a customer clustering/segmentation dashboard in the following JSON format with 3 meaningful and helpful cards and 6 meaningful and understandable charts (line, bar, pie, or scatter):
    IMPORTANT: DONOT USE HISTOGRAMS. ALSO ENSURE TO KEEP THE CHART MEANINGFUL AND UNDERSTANDABLE BY KEEPING YOURSELF IN CUSTOMER SHOES. ALSO SINCE THESE ARE LARGE DATASETS SO FOR LINE AND BAR CHARTS WE CAN DO TOP 5 CHARTS OR FOR DATES WE CAN PERFORM AGGREGATE ON YEAR/MONTHS

    {{
        "dashboard_title": "Customer Analysis Dashboard",
        "rows": [
            {{
                "row_type": "cards",
                "items": [
                    {{
                        "title": "string",
                        "col_name": "string",
                        "function": "sum/avg/max/min"
                    }},
                    {{
                        "title": "string",
                        "col_name": "string",
                        "function": "sum/avg/max/min"
                    }},
                    {{
                        "title": "string",
                        "col_name": "string",
                        "function": "sum/avg/max/min"
                    }}
                ]
            }},
            {{
                "row_type": "charts",
                "charts": [
                    {{
                        "title": "string",
                        "type": "line/bar/pie/scatter",
                        "x_axis_column": "string",
                        "y_axis_column": "string"
                    }},
                    {{
                        "title": "string",
                        "type": "line/bar/pie/scatter",
                        "x_axis_column": "string",
                        "y_axis_column": "string"
                    }},
                    {{
                        "title": "string",
                        "type": "line/bar/pie/scatter",
                        "x_axis_column": "string",
                        "y_axis_column": "string"
                    }},
                    {{
                        "title": "string",
                        "type": "line/bar/pie/scatter",
                        "x_axis_column": "string",
                        "y_axis_column": "string"
                    }}
                ]
            }}
        ]
    }}

    Here is the list of my dataset colums and cluster group summaries:
    {combined_dict}

    {format_instructions}
    """

    prompt = PromptTemplate(
        input_variables=["summary"],
        template=prompt_template,
        partial_variables={"format_instructions": format_instructions},
    )

    response = model.generate_content(prompt.format(combined_dict=combined_dict))
    output = ""
    for chunk in response:
        output += chunk.text

    try:
        output = repair_json(output)
        visualizations = json.loads(output)
    except json.JSONDecodeError as e:
        raise ValueError(f"Generated content is not valid JSON: {e}")
        
    return visualizations

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (np.integer, np.int64)):
            return int(obj)
        elif isinstance(obj, (np.floating, np.float64)):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NumpyEncoder, self).default(obj)

def convert_keys_to_str(d):
    """ Recursively convert dictionary keys to strings. """
    if isinstance(d, dict):
        return {str(k): convert_keys_to_str(v) for k, v in d.items()}
    elif isinstance(d, list):
        return [convert_keys_to_str(i) for i in d]
    else:
        return d

def calculate_dashboard_metrics(response, dataset, cluster_col='label'):
    df = pd.DataFrame(dataset)
    
    overall_metrics = {}
    cluster_metrics = {str(cluster): {} for cluster in df[cluster_col].unique()}
    
    for row in response.get('rows', response.get('response', {}).get('rows', [])):
        if row["row_type"] == "cards":
            for item in row["items"]:
                col_name = item["col_name"]
                func = item["function"]
                
                if func == "sum":
                    overall_value = round(df[col_name].sum(), 2)
                elif func == "avg":
                    overall_value = round(df[col_name].mean(), 2)
                elif func == "count":
                    overall_value = df[col_name].count()
                elif func == "max":
                    overall_value = round(df[col_name].max(), 2)
                elif func == "min":
                    overall_value = round(df[col_name].min(), 2)
                else:
                    overall_value = None
                
                overall_metrics[item["title"]] = overall_value
                
                for cluster, group in df.groupby(cluster_col):
                    if func == "sum":
                        cluster_value = round(group[col_name].sum(), 2)
                    elif func == "avg":
                        cluster_value = round(group[col_name].mean(), 2)
                    elif func == "count":
                        cluster_value = group[col_name].count()
                    elif func == "max":
                        cluster_value = round(group[col_name].max(), 2)
                    elif func == "min":
                        cluster_value = round(group[col_name].min(), 2)
                    else:
                        cluster_value = None
                    
                    cluster_metrics[str(cluster)][item["title"]] = cluster_value
                
                item["value"] = overall_value
                item["cluster_values"] = {str(cluster): cluster_metrics[str(cluster)][item["title"]] for cluster in cluster_metrics}
    
        elif row["row_type"] == "charts":
            for chart in row["charts"]:
                x_column = chart.get("x_axis_column")
                y_column = chart.get("y_axis_column")

                if chart["type"] == "pie":
                    if x_column and x_column in df.columns:
                        value_counts = df[x_column].value_counts()
                        chart["data"] = {
                            "labels": value_counts.index.tolist(),
                            "datasets": [{
                                "label": f"Distribution of {x_column}",
                                "data": value_counts.tolist(),
                            }]
                        }

                elif chart["type"] == "line":
                    if x_column in df.columns and y_column in df.columns:
                        grouped = df.groupby(x_column)[y_column].sum().reset_index()
                        x_data = grouped[x_column].tolist()
                        y_data = grouped[y_column].tolist()
                        chart["data"] = {
                            "labels": x_data,
                            "datasets": [{
                                "label": f"Line Chart of {y_column} over {x_column}",
                                "data": y_data,
                            }]
                        }

                elif chart["type"] == "bar":
                    if x_column in df.columns and y_column in df.columns:
                        grouped = df.groupby(x_column)[y_column].sum().reset_index()
                        x_data = grouped[x_column].tolist()
                        y_data = grouped[y_column].tolist()
                        chart["data"] = {
                            "labels": x_data,
                            "datasets": [{
                                "label": f"Bar Chart of {y_column} over {x_column}",
                                "data": y_data,
                            }]
                        }

                elif chart["type"] == "scatter":
                    if x_column in df.columns and y_column in df.columns:
                        scatter_data = [
                            {"x": df[x_column].iloc[i], "y": df[y_column].iloc[i]}
                            for i in range(len(df))
                        ]
                        chart["data"] = {
                            "datasets": [{
                                "label": f"Scatter Plot of {y_column} vs {x_column}",
                                "data": scatter_data,
                            }]
                        }
                        
    # Convert response to JSON string, repair it, then convert back to dictionary
    response_json_str = json.dumps(response, cls=NumpyEncoder)
    repaired_json_str = repair_json(response_json_str)
    updated_response = json.loads(repaired_json_str)
    
    # Ensure all keys in the response are strings
    updated_response = convert_keys_to_str(updated_response)
    
    return updated_response