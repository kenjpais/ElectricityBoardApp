from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from .models import Connection
import random
import string
import json
from datetime import date
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from .serializers import *
from rest_framework.decorators import api_view


def generate_unique_code():
    length = 6
    print("Entering generate_unique_code")
    while True:
        unique_code = "".join(random.choices(string.digits, k=length))
        if not User.objects.filter(id=unique_code).exists():
            print(unique_code)
            break

    return unique_code

@api_view(["GET", "PUT", "DELETE"])
def connection_detail(request, pk):
    try:
        connection = Connection.objects.get(pk=pk)
    except Connection.DoesNotExist:
        return Response(status=404)

    if request.method == "GET":
        serializer = ConnectionSerializer(connection)
        return Response(serializer.data)
    elif request.method == "PUT":
        serializer = ConnectionSerializer(connection, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        connection.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
def create_connection(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print(data)
            data["ID"] = str(generate_unique_code())
            data["Date_of_Application"] = date.today()
            data["Modified_Date"] = date.today()
            data["Status"] = "Pending"
            print(data)
            serializer = ConnectionSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print("Error:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except json.JSONDecodeError:
            return JsonResponse(
                {"error": "Invalid JSON data"}, status=status.HTTP_400_BAD_REQUEST
            )


@api_view(["POST"])
def create_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            data["id"] = str(generate_unique_code())
            print(data)
            serializer = UserSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except json.JSONDecodeError:
            return JsonResponse(
                {"error": "Invalid JSON data"}, status=status.HTTP_400_BAD_REQUEST
            )


@csrf_exempt
@api_view(["GET"])
def filter_connections(request):
    applicant_id = request.query_params.get("applicantId")if request.query_params.get("applicantId") else ""
    start_date = request.query_params.get("startDate")
    end_date = request.query_params.get("endDate")
    conn_status = request.query_params.get("status")
    applicant_id = applicant_id if applicant_id else ""
    start_date = start_date if start_date else ""
    end_date = end_date if end_date else ""
    conn_status = conn_status if conn_status else ""
    print(
        f"Filtering according to [{applicant_id} {start_date} {end_date} {conn_status}]"
    )

    if applicant_id:
        connections = Connection.objects.filter(ID_Number=applicant_id)
    elif start_date:
        connections = Connection.objects.filter(
            Date_of_Application__range=[start_date, date.today()])
    elif start_date and end_date:
        connections = Connection.objects.filter(
            Date_of_Application__range=[start_date, end_date])
    elif conn_status and start_date and end_date:
        connections = Connection.objects.filter(
            Date_of_Application__range=[start_date, end_date], Status=conn_status)
    elif conn_status:
        print(f"Filtering {conn_status}")
        connections = Connection.objects.filter(Status=conn_status)
    else:
        connections = Connection.objects.all()
    if not connections.exists():
        return Response(
            {"message": "No connections found"}, status=status.HTTP_404_NOT_FOUND
        )
    serializer = ConnectionSerializer(connections, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
