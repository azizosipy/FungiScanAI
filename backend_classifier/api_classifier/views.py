import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from PIL import Image
from transformers import ViTFeatureExtractor, ViTForImageClassification
import torch

# Initialize the model and feature extractor
MODEL_NAME = 'wambugu71/crop_leaf_diseases_vit'
feature_extractor = ViTFeatureExtractor.from_pretrained(MODEL_NAME)
model = ViTForImageClassification.from_pretrained(MODEL_NAME)

# Disease advice dictionary
DISEASE_ADVICE = {
    "Corn___Common_Rust": [
        "Plant rust-resistant corn hybrids to reduce infection risk.",
        "Apply fungicides like Azoxystrobin at the first sign of rust.",
        "Rotate crops with non-host plants to break the disease cycle.",
        "Improve plant spacing for better airflow and reduced humidity.",
        "Monitor fields regularly to detect and control infections early.",
        "Destroy infected plant debris after harvest to prevent overwintering spores.",
        "Use balanced nitrogen fertilization to avoid excessive leaf growth."
    ],
    "Corn___Gray_Leaf_Spot": [
        "Choose resistant corn hybrids to minimize infection chances.",
        "Apply fungicides like Propiconazole if disease pressure is high.",
        "Practice crop rotation with non-host crops to break the disease cycle.",
        "Remove infected plant debris after harvest to prevent fungal buildup.",
        "Ensure proper plant spacing for airflow and humidity control.",
        "Regularly scout fields and act early upon symptom detection.",
        "Avoid excessive nitrogen application, as it encourages leaf growth and disease."
    ],
    "Corn___Leaf_Blight": [
        "Use resistant corn hybrids to protect against leaf blight.",
        "Apply Mancozeb or Propiconazole fungicides when lesions appear.",
        "Ensure proper spacing between plants to reduce humidity.",
        "Remove and destroy infected leaves to slow disease progression.",
        "Balance nitrogen fertilization to avoid excessive leaf growth.",
        "Rotate crops yearly to minimize disease buildup in the soil.",
        "Regularly check for symptoms and apply treatments early."
    ],
    "Corn___Healthy": [
        "Your corn is healthy! Maintain proper care to ensure continuous growth.",
        "Practice crop rotation and choose disease-resistant corn varieties.",
        "Use balanced fertilization and irrigation for sustained plant health.",
        "Monitor fields regularly to prevent any early disease outbreaks.",
        "Control weeds and pests to avoid competition and ensure robust growth.",
        "Use high-quality seeds to promote strong germination and resistance.",
        "Properly store harvested corn to prevent post-harvest diseases."
    ],
    "Potato___Early_Blight": [
        "Use resistant potato varieties to minimize early blight risk.",
        "Apply Chlorothalonil or Mancozeb fungicides at first symptoms.",
        "Ensure good soil drainage to prevent excess moisture buildup.",
        "Destroy infected plant debris to limit disease spread.",
        "Space potato plants properly to improve air circulation.",
        "Monitor fields closely and treat infections early.",
        "Avoid overhead irrigation, as wet leaves encourage blight."
    ],
    "Potato___Late_Blight": [
        "Use Metalaxyl-based fungicides when late blight symptoms appear.",
        "Avoid excessive irrigation to reduce moisture that favors disease.",
        "Destroy infected plants immediately to prevent disease spread.",
        "Monitor fields during cool and humid conditions for early signs.",
        "Rotate crops to break the disease cycle and reduce pathogen buildup.",
        "Apply fungicides before rainy seasons to prevent outbreaks.",
        "Ensure proper air circulation around plants for disease control."
    ],
    "Potato___Healthy": [
        "Your potato crop is healthy! Keep practicing good field management.",
        "Rotate crops yearly to prevent disease buildup in the soil.",
        "Maintain balanced fertilization for optimal plant health.",
        "Regularly check for symptoms to catch any diseases early.",
        "Use certified disease-free seeds to ensure strong plant development.",
        "Manage water properly to avoid excessive moisture stress.",
        "Keep fields weed-free to prevent competition and improve growth."
    ],
    "Rice___Brown_Spot": [
        "Use resistant rice varieties to minimize the impact of brown spot.",
        "Apply fungicides like Tricyclazole or Mancozeb when needed.",
        "Improve soil drainage to prevent excessive moisture conditions.",
        "Destroy infected plant debris to limit disease recurrence.",
        "Maintain proper fertilization with potassium and phosphorus.",
        "Monitor the crop during humid conditions to detect early symptoms.",
        "Use high-quality certified seeds for strong and healthy plant growth."
    ],
    "Rice___Leaf_Blast": [
        "Choose blast-resistant rice varieties to prevent infection.",
        "Apply Tricyclazole or Isoprothiolane fungicides when symptoms appear.",
        "Manage water effectively with alternating wet and dry cycles.",
        "Remove infected plant debris to prevent future outbreaks.",
        "Ensure proper spacing between rice plants for airflow control.",
        "Monitor during humid seasons for early disease signs.",
        "Maintain balanced fertilization to strengthen plant immunity."
    ],
    "Rice___Healthy": [
        "Your rice crop is healthy! Maintain proper agricultural practices.",
        "Ensure a balanced fertilization plan to sustain strong plant growth.",
        "Regularly check the crop for signs of disease to act early.",
        "Use quality-certified seeds for optimal yield and disease resistance.",
        "Manage water distribution effectively to avoid stress.",
        "Control weeds to reduce competition and disease risks.",
        "Rotate crops to maintain soil health and limit disease spread."
    ],
    "Wheat___Brown_Rust": [
        "Use rust-resistant wheat varieties for better disease control.",
        "Apply Propiconazole or Tebuconazole fungicides if needed.",
        "Improve soil drainage to prevent excessive moisture buildup.",
        "Remove infected volunteer wheat plants to reduce reinfection.",
        "Monitor fields frequently, especially in humid conditions.",
        "Avoid excessive nitrogen use to prevent unnecessary lush growth.",
        "Ensure proper seed treatment with fungicides before planting."
    ],
    "Wheat___Yellow_Rust": [
        "Apply Propiconazole fungicide at the first sign of infection.",
        "Rotate crops with non-cereal plants to disrupt the disease cycle.",
        "Monitor fields during cool, moist conditions to detect rust early.",
        "Remove infected plants to prevent disease spread across crops.",
        "Avoid excessive nitrogen fertilizers, as they promote fungal growth.",
        "Use high-quality certified seeds for better plant resilience.",
        "Maintain a weed-free field to reduce alternative hosts for fungi."
    ],
    "Wheat___Healthy": [
        "Your wheat crop is in great condition! Keep up good farming practices.",
        "Practice crop rotation and choose disease-resistant wheat varieties.",
        "Monitor fields regularly to catch any diseases early.",
        "Use balanced fertilization and proper irrigation for sustained health.",
        "Ensure high-quality seeds to promote disease-free plant growth.",
        "Control weeds and pests to reduce competition and maintain yield.",
        "Properly store harvested wheat to prevent post-harvest diseases."
    ],
    "Invalid": [
        "Invalid input detected. Please check your image and try again.",
        "Ensure the uploaded image is clear and correctly formatted.",
        "If this error persists, verify that the image meets model requirements.",
        "Try submitting another image with better resolution and proper plant focus.",
        "Refer to agricultural experts for additional disease identification help.",
        "Check API documentation to confirm proper request formatting.",
        "Double-check spelling and input format before submitting."
    ]
}

class PredictView(APIView):
    def post(self, request, *args, **kwargs):
        print("\n[INFO] Request received for image classification...")

        if 'image' not in request.FILES:
            print("[ERROR] No image provided in request.")
            return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Load the image directly from the uploaded file
            img_file = request.FILES['image']
            print(f"[INFO] Received image: {img_file.name}, Size: {img_file.size} bytes")

            # Open the image and convert to RGB format
            image = Image.open(img_file).convert("RGB")
            print("[INFO] Image successfully loaded and converted to RGB format.")

            # Preprocess the image
            inputs = feature_extractor(images=image, return_tensors="pt")
            print("[INFO] Image preprocessing completed.")

            # Perform inference
            with torch.no_grad():
                outputs = model(**inputs)
                logits = outputs.logits
                predicted_class_idx = logits.argmax(-1).item()

            # Get the predicted label
            predicted_class = model.config.id2label.get(predicted_class_idx, "Invalid")
            print(f"[SUCCESS] Prediction completed. Predicted class: {predicted_class}")

            # Get random advice for the predicted class
            advice_list = DISEASE_ADVICE.get(predicted_class, DISEASE_ADVICE["Invalid"])
            random_advice = random.choice(advice_list)

            return Response(
                {
                    "predicted_class": predicted_class,
                    "advice": random_advice
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            print(f"[ERROR] Exception occurred: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
