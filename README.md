#Electricity_Board_App
Tech Stack:

Frontend - React,  HTML, CSS, Javascript, Libraries{Material UI, HighCharts('highcharts-react-official')}
Backend - Django, Python

Installation Requirements:

Backend

Install python 3.11
pip install Django==5.0.2
pip install django-cors-headers==4.3.1
pip install djangorestframework==3.14.0
pip install requests==2.31.0
pip install virtualenv==20.23.0

refer requirements.txt for full list of dependencies incase of versioning issues

Frontend

Install nodejs v20.11.1

npm install create-react-app
npm install highcharts
npm install highcharts-react-official
npm install react-select
npm install react-router-dom

refer package.json for full list of dependencies incase of versioning issues

{
  "name": "frontend",
  "version": "1.0.0",
  "lockfileVersion": 2,
  "requires": true,
  "packages": {
    "": {
      "name": "frontend",
      "version": "1.0.0",
      "license": "ISC",
      "dependencies": {
        "@babel/plugin-proposal-class-properties": "^7.18.6",
        "@material-ui/core": "^4.12.4",
        "@material-ui/icons": "^4.11.3",
        "@material-ui/lab": "^4.0.0-alpha.61",
        "@mui/lab": "^5.0.0-alpha.165",
        "@mui/material": "^5.15.10",
        "highcharts": "^11.3.0",
        "highcharts-react-official": "^3.2.1",
        "react-router-dom": "^5.3.0",
        "react-select": "^5.8.0",
      }
}}

################ Running application directly ##################

Extract EB.zip into a directory

cd /EB/electric/

Run backend:
python manage.py makemigrations
python manage.py migrate
python manage.py runserver

Run frontend:
cd /EB/electric/frontend
npm run dev


########### Creating project structure from scratch ############

Backend:
django-admin startproject backend
python manage.py startapp backend
python manage.py startapp frontend
python manage.py startapp api
python manage.py makemigrations
python manage.py migrate
python manage.py runserver

Frontend:

npx create-react-app frontend
npm install -D webpack-cli	//if running through dev script, make sure babel.config.json and webpackconfig.json is present in current directory
npm run dev 			//if running through dev script

or

npm init react-app frontend
npm run

Make sure folder structure is same as the EB.zip folder structure
frontend folder should contain node_modules, package.json as well as urls.py, views.py
for react routes to be routed and linked to django urls

#------------------------------------------------------------------#

Server should be listening on http:://localhost:8000/

ALLOWED_HOSTS = ["0.0.0.0", "127.0.0.1", "127.0.0.0", "localhost", "192.168.0.107"]

Refer backend/settings.py for more details

Testing:
Run test.py to run http calls to backend APIs and also fill db with values from csv file.

Documentation:
Refer Ken_Jonathan_Pais_Case_Study_Submission.docx for full documentation
