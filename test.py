import pandas as pd
import json
import requests
from datetime import datetime

def format(date_string):
    # date_obj = datetime.strptime(date_string, "%m-%d-%y")
    # return date_obj.strftime("%Y-%m-%d")
    return "2024-02-14"

def upload():
    df = pd.read_csv("electricity_board_case_study.csv")

    # Convert float columns to string to prevent out of range float values error
    float_cols = df.select_dtypes(include=["float64"]).columns
    df[float_cols] = df[float_cols].astype(str)

    # Convert the DataFrame to a JSON array of objects
    json_data = df.to_dict(orient="records")

    # Write the JSON data to a file
    with open("output.json", "w") as f:
        json.dump(json_data, f, indent=4)

    i = 0
    user_id = str()
    for obj in json_data:
        print(obj)
        try:
            response = requests.post("http://localhost:8000/api/create-user", json=obj)
            if response.ok:
                user_id = response.json()["id"]
            else:
                print("Error", response.json())

            obj["ID"] = user_id
            obj["ID_Number"] = user_id
            obj["Category"] = obj.get("Category", "RESIDENTIAL")
            obj["Load_Applied"] = 100
            obj["Date_of_Application"] = format(obj["Date_of_Application"])
            obj["Date_of_Approval"] = format(obj["Date_of_Approval"])
            obj["Modified_Date"] = format(obj["Modified_Date"])
            
            if {obj['Date_of_Application']} == "2024-02-14":
                print(f"\n\n\n{obj['Date_of_Application']}\n\n\n")
                continue
            response = requests.post(
                "http://localhost:8000/api/create-connection", json=obj
            )
            if response.ok:
                i += 1
                print(f"\n\nConnection Created")
            else:
                print("Error", response.json)
            if i > 90:
                break
        except requests.exceptions.RequestException as e:
            print(f"Request failed for object:Error: {e}")
upload()
