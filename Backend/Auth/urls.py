from rest_framework.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView 
from .views import *

urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("register/", UserRegister.as_view(), name="register"),
    path("delete/<int:pk>", UserDeleteView.as_view(), name="delete"),
    path("update/<int:pk>", UpdateUserView.as_view(), name="update"),
    path("list/", UserListView.as_view(), name="list"),
    path("profile/", UserProfilView.as_view(), name="profile")
]
