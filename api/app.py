from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import json
from utils.segmentation import read_csv_from_content, clean_data, generate_visualizations, calculate_dashboard_metrics, normalize_columns, k_means, analyze_summary_dynamic, generate_persona, initialize

initialize()
app = Flask(__name__)
CORS(app)

data_store = {}

@app.route('/', methods=['GET'])
def root():
    return 'Persona Genius API'

@app.route('/upload', methods=['POST'])
def upload_file():
    uploaded_file = request.files.get('file')
    selected_features_json = request.form.get('selected_features')
    selected_features = json.loads(selected_features_json) if selected_features_json else []

    if not uploaded_file or not uploaded_file.filename.endswith(".csv"):
        return jsonify({"error": "Unsupported file format. Please upload a CSV file."}), 400

    try:
        file_content = uploaded_file.read()
        data = read_csv_from_content(file_content)
        data_store['raw_data'] = data
        data_store['selected_features'] = data[selected_features]

        return jsonify({"message": "Data uploaded successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"Error processing data: {e}"}), 400
    
@app.route('/eda', methods=['GET'])
def eda_file():
    try:
        cleaned_data = clean_data(data_store['selected_features'])
        normalized_data = normalize_columns(cleaned_data)
        
        data_store['cleaned_data'] = normalized_data

        return jsonify({"message": "Data cleaned and EDA done successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"Error processing data: {e}"}), 400

@app.route('/cluster', methods=['GET'])
def cluster_data():
    try:
        cleaned_data = data_store['cleaned_data']
        raw_data = data_store['raw_data']
        
        k_means(raw_data, cleaned_data)

        return jsonify({"message": "Data clustered successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"Error clustering data: {e}"}), 400

@app.route('/summary', methods=['GET'])
def generate_summary():
    try:
        dt = pd.read_csv('./data/labeled_data.csv', index_col=0)
        analyze_summary_dynamic(dt, 'label')
        
        summary = pd.read_csv('./data/summary_result.csv')
        summary_dict = summary.to_dict(orient='records')
        personas = generate_persona(summary_dict)
        
        return jsonify(personas), 200

    except Exception as e:
        return jsonify({"error": f"Error generating summary and personas: {e}"}), 400

@app.route('/analytics', methods=['GET'])
def generate_analytics():
    try:
        summary = pd.read_csv('./data/summary_result.csv')
        summary_dict = summary.to_dict(orient='records')
        
        dt = pd.read_csv('./data/labeled_data.csv', index_col=0)
        
        combined_dict = {
            'summary': summary_dict,
            'col_names': dt.columns.tolist()
        }
        
        visualizations = generate_visualizations(dt.columns.tolist())
        calculatedVisualizations = calculate_dashboard_metrics(visualizations, dt)
        
        return json.dumps(calculatedVisualizations), 200

    except Exception as e:
        return jsonify({"error": f"Error generating analytics: {e}"}), 400
    
if __name__ == "__main__":
    app.run(port=8000)