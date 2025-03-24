function createLink(name, size = null) {
    const fallback = "/images/missing_product.jpg";
    const displayName = name.replace(/_/g, " ");
    const imageBase = `/images/${name}_image_`;

    const div = document.createElement("div");
    div.className = "item";
    div.dataset.name = name;

    if (size) {
        const img = document.createElement("img");
        img.src = `${imageBase}${size}.jpg`;
        img.alt = displayName;
        img.onerror = () => { img.src = fallback; };
        div.appendChild(img);
    } else {
        const picture = document.createElement("picture");

        const sources = [
            { media: "(min-width: 1200px)", size: "large" },
            { media: "(min-width: 768px)", size: "medium" },
            { media: "(min-width: 480px)", size: "small" }
        ];

        sources.forEach(({ media, size }) => {
            const source = document.createElement("source");
            source.media = media;
            source.srcset = `${imageBase}${size}.jpg`;
            picture.appendChild(source);
        });

        const img = document.createElement("img");
        img.src = `${imageBase}tiny.jpg`;
        img.alt = displayName;
        img.onerror = () => { img.src = fallback; };
        picture.appendChild(img);
        div.appendChild(picture);
    }

    const caption = document.createElement("p");
    caption.textContent = displayName;
    div.appendChild(caption);

    return div;
}

fetch("/data/products.json")
    .then(res => res.json())
    .then(data => {
        const gallery = document.getElementById("gallery");
        data.forEach(product => {
            const title = product["Product-title"];
            const name = title.trim().replace(/\s+/g, "_");
            gallery.appendChild(createLink(name));
        });
    })
    .catch(err => {
        console.error("Error loading product data:", err);
    });
