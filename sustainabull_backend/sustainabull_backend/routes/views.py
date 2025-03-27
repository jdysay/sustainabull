from django.http import JsonResponse
from .ors_service import get_route_from_ors  

def get_route(request):
    start_lat = request.GET.get("start_lat")
    start_lng = request.GET.get("start_lng")
    end_lat = request.GET.get("end_lat")
    end_lng = request.GET.get("end_lng")

    if not all([start_lat, start_lng, end_lat, end_lng]):
        return JsonResponse({"error": "Missing parameters"}, status=400)

    route_data = get_route_from_ors(start_lat, start_lng, end_lat, end_lng)

    if "error" in route_data:
        return JsonResponse(route_data, status=route_data.get("status", 500))

    return JsonResponse(route_data, safe=False)
