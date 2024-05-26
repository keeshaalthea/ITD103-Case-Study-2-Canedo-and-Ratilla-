#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <TimeLib.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1

#define DHTPIN D6
#define DHTTYPE DHT11
#define LIGHT_SENSOR_PIN A0

const char* ssid = "no"; // Replace with your network credentials
const char* password = "jesonjejemon";
const char* serverUrl = "http://192.168.222.22:3000/sensordatas"; // Use the correct endpoint

DHT dht(DHTPIN, DHTTYPE);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

unsigned long previousMillis = 0;
const long interval = 30000; // 30 seconds

void setup() {
  Serial.begin(115200);
  delay(100);

  Serial.println();
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi...");
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi connected");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.setTextColor(WHITE);
  dht.begin();
}

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int lightIntensity = analogRead(LIGHT_SENSOR_PIN);

    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.print(" °C, Humidity: ");
    Serial.print(humidity);
    Serial.print(" %, Light Intensity: ");
    Serial.println(lightIntensity);

    display.clearDisplay();
    display.setTextSize(2);
    display.setCursor(0, 0);
    display.print("Temp: ");
    display.print(temperature);
    display.println(" C");
    display.print("Humidity: ");
    display.print(humidity);
    display.println(" %");
    display.print("Light: ");
    display.println(lightIntensity);
    display.display();

    if (WiFi.status() == WL_CONNECTED) {
      WiFiClient client;
      HTTPClient http;

      // Get current timestamp in seconds since the epoch
      time_t timestamp = now();

      // Get current date
      String date = String(year()) + "-" + String(month()) + "-" + String(day());

      Serial.println("Preparing to send POST request");
      Serial.print("Connecting to server: ");
      Serial.println(serverUrl);

      if (http.begin(client, serverUrl)) {
        Serial.println("Connection established");
        http.addHeader("Content-Type", "application/json");

        // Construct JSON payload with sensor data, timestamp, and date
        String jsonData = "{\"temperature\": " + String(temperature) + ", \"humidity\": " + String(humidity) + ", \"lightIntensity\": " + String(lightIntensity) + ", \"timestamp\": " + String(timestamp) + ", \"date\": \"" + date + "\"}";
        Serial.print("Sending data: ");
        Serial.println(jsonData);

        int httpResponseCode = http.POST(jsonData);

        if (httpResponseCode > 0) {
          String response = http.getString();
          Serial.println("HTTP Response code: " + String(httpResponseCode));
          Serial.println("Response: " + response);
        } else {
          Serial.print("Error on sending POST: ");
          Serial.println(httpResponseCode);
          Serial.println(http.errorToString(httpResponseCode));
        }

        http.end();
      } else {
        Serial.println("Unable to connect");
      }
    } else {
      Serial.println("WiFi Disconnected");
    }

    delay(3000);
  }
}
