const gallery = document.getElementById("gallery");
const mainImage = document.getElementById("main-image");
const sizeRadios = document.querySelectorAll('input[name="size"]');

let currentBaseName = null;
let currentSize = "tiny";

fetch("/data/products.json")
    .then(res => res.json())
    .then(data => {
        const productNames = data.map(p =>
            p["Product-title"].trim().replace(/\s+/g, "_")
        );

        productNames.forEach(name => {
            const img = document.createElement("img");
            img.src = `/images/${name}_image_tiny.jpg`;
            img.alt = name.replace(/_/g, " ");
            img.addEventListener("click", () => {
                currentBaseName = name;
                updateMainImage();
            });
            gallery.appendChild(img);
        });

        currentBaseName = productNames[0];
        updateMainImage();
    })
    .catch(err => {
        console.error("Failed to load product data:", err);
    });

sizeRadios.forEach(radio => {
    radio.addEventListener("change", e => {
        currentSize = e.target.value;
        updateMainImage();
    });
});

function updateMainImage() {
    if (!currentBaseName) return;
    mainImage.src = `/images/${currentBaseName}_image_${currentSize}.jpg`;
    mainImage.alt = currentBaseName.replace(/_/g, " ");
}
