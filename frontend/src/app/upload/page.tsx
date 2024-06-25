"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadFile, uploadSampleDataset } from '@/lib/api/results/service';
import CustomToast from '@/components/global/custom-toast';
import { toast } from 'sonner';
import Select from "react-select";
import CustomSelect from '@/components/ui/multi-select';

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [selected, setSelected] = useState<Options[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [options, setOptions] = useState<Options[]>([]);
  const router = useRouter();

  interface Options {
    value: string;
    label: string;
  }
  const sampleDatasets = [
    {
      name: 'sample-dataset1.csv',
      title: 'Mall Customers Dataset',
      description: 'This dataset contains information about mall customers, including Customer ID, Gender, Age, Annual Income (k$), and Spending Score (1-100). It can be used for customer segmentation, targeting marketing strategies, and understanding consumer behavior patterns in a retail environment.',
      link: 'https://www.kaggle.com/datasets/shwetabh123/mall-customers',
      selected_features: ['Annual Income (k$)', 'Spending Score (1-100)']
    },
    {
      name: 'sample-dataset2.csv',
      title: 'Marketing Dataset',
      description: 'This grocery store customer information dataset includes age, marital status, number of children, annual income, and spending on various products. It helps analyze purchasing patterns and preferences for items like wine, fruits, meat, seafood, sweets, gold, and on-sale products.',
      link: 'https://www.kaggle.com/code/karnikakapoor/customer-segmentation-clustering/data',
      selected_features: ['Income', 'Recency']
    },
    {
      name: 'basket_details.csv',
      title: 'Sales Dataset',
      description: 'This dataset provides information on e-commerce sales, including details about the items in baskets, such as product ID, description, quantity, price, and customer ID. It can be useful for analyzing sales patterns, customer behavior, and market trends in online retail.',
      link: 'https://www.kaggle.com/datasets/berkayalan/ecommerce-sales-dataset?select=basket_details.csv',
      selected_features: ['product_id', 'basket_date', 'basket_count']
    },
    {
      name: 'data.csv',
      title: 'Transactions Dataset',
      description: 'This dataset includes information about e-commerce transactions, such as invoice number, stock code, description of items, quantity, invoice date, unit price, customer ID, and country. It can be used for analyzing sales trends, customer behavior, and inventory management in an e-commerce setting.',
      link: 'https://www.kaggle.com/datasets/carrie1/ecommerce-data',
      selected_features: ['Quantity', 'UnitPrice', 'Country']
    },
    {
      name: 'ecommerce-customers.csv',
      title: 'Customers Dataset',
      description: 'This dataset provides information about e-commerce customers, including customer ID, gender, age, annual spending, and number of purchases. It can be utilized for customer segmentation, market analysis, and personalized marketing strategies in the e-commerce industry.',
      link: 'https://www.kaggle.com/datasets/srolka/ecommerce-customers',
      selected_features: ['Yearly Amount Spent', 'Length of Membership', 'Avg. Session Length']
    }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setOptions([]);
      setFile(selectedFile);

      const fileReader = new FileReader();
      fileReader.readAsText(selectedFile, "UTF-8");
      fileReader.onload = e => {
        const content = e?.target?.result as string;
        if (content) {
          setFileContent(content);
        }
      };
    }
  };

  const performClustering = async () => {
    try {
      if (!file) return;

      setLoading(true);

      const formData = new FormData();
      formData.append('file', file);

      const selectedOptions = selected.map((item: Options) => item.value);
      formData.append('selected_features', JSON.stringify(selectedOptions));

      const uploadResponse = await uploadFile(formData);
      setLoading(false);

      if (uploadResponse) {
        toast(CustomToast({ title: "Success", description: "Data uploaded successfully." }));
        router.push('/dashboard');
      }
    } catch (error) {
      setLoading(false);
      toast(CustomToast({ title: "Error", description: "Failed to upload the file." }));
    }
  };

  useEffect(() => {
    if (fileContent) {
      const firstLine = fileContent.substring(0, fileContent.indexOf('\n'));

      const delimiters = [',', '\t', ';', '|'];
      let delimiter = ',';
      for (const d of delimiters) {
        if (firstLine.includes(d)) {
          delimiter = d;
          break;
        }
      }

      const headers = firstLine.split(delimiter).map(header => header.trim());
      const options = headers.map(header => ({
        label: header,
        value: header
      }));

      setOptions(options);
    }
  }, [fileContent]);

  const handleSampleDatasetOnClick = async (datasetName: string, selectedFeatures: string[]) => {
    setLoading(true);
    try {
      const uploadResponse = await uploadSampleDataset(datasetName, selectedFeatures);
      setLoading(false);

      if (uploadResponse) {
        toast(CustomToast({ title: "Success", description: "Data uploaded successfully." }));
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Error downloading or uploading the file:", error);
      setLoading(false);
      toast(CustomToast({ title: "Error", description: "Failed to upload the dataset." }));
    }
  };

  const handleTypeSelect = (selectedOptions: Options[]) => {
    setSelected(selectedOptions);
  };

  return (
    <div className="flex justify-center items-start h-fit">
      <div className="space-y-2 flex-1">
        <div className="text-center d-flex justify-center align-center">
          <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text">
            <div className="text-5xl my-4 font-bold">Welcome to PersonaGenius</div>
          </div>
          <div className="text-muted-foreground text-md">
            Transform Your E-commerce Strategy with Smart Customer <br /> Personas and Segmentation.
          </div>
        </div>
        <div className="flex flex-col items-center mt-2">
          <div className="flex flex-col items-center mt-4">
            <label htmlFor="fileInput" className="w-fit flex flex-row gap-2 rounded-lg bg-primary px-10 py-4 font-medium text-white text-sm items-center">
              {file ? 'Change dataset' : 'Select your dataset'}
              <input
                id="fileInput"
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
              />
            </label>
            {options.length > 0 && <>
              <CustomSelect
                options={options}
                handleTypeSelect={handleTypeSelect}
                isOptionDisabled={() => selected.length >= 5}
              />
              <button
                className="text-blue-500 mt-3 rounded border px-4 py-2"
                onClick={() => performClustering()}
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Perform clustering'}
              </button>
            </>}

          </div>

          {options.length <= 0 && <>
            <div className="flex items-center my-10 w-full">
              <div className="border-t flex-grow"></div>
              <span className="mx-4 text-xl-3">Or try one of the sample datasets</span>
              <div className="border-t flex-grow"></div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {sampleDatasets.map((dataset, index) => (
                <div key={index} className="border border-gray-300 p-4 rounded w-64 text-center flex flex-col">
                  <h2 className="text-lg font-semibold">
                    <a href={dataset.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      {dataset.title}
                    </a>
                  </h2>
                  <p className="text-sm mt-2">
                    {dataset.description}
                  </p>
                  <div className="flex-grow"></div>
                  <button
                    className="text-blue-500 mt-3 rounded border px-4 py-2"
                    onClick={() => handleSampleDatasetOnClick(dataset.name, dataset.selected_features)}
                    disabled={loading}
                  >
                    Use this dataset
                  </button>
                </div>
              ))}
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}
