FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["EnagramTransferApp/EnagramTransferApp.csproj", "EnagramTransferApp/"]
RUN dotnet restore "EnagramTransferApp/EnagramTransferApp.csproj"

# Copy everything else and build the app
COPY . .
WORKDIR "/src/EnagramTransferApp"
RUN dotnet build "EnagramTransferApp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "EnagramTransferApp.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "EnagramTransferApp.dll"]
