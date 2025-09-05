let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let preview = document.getElementById("preview");
let encryptedData = "";
let decryptPopup = document.getElementById("decryptPopup");

// Load image
document
  .getElementById("imageInput")
  .addEventListener("change", function (event) {
    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function (e) {
      let img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        preview.src = canvas.toDataURL();
        preview.style.display = "block";
        document.getElementById("status").textContent =
          "Image Loaded. Ready to encrypt!";
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

// Encrypt image
function encryptImage() {
  let key = document.getElementById("keyInput").value;
  if (!key) {
    alert("Enter encryption key");
    return;
  }

  let base64 = canvas.toDataURL();
  encryptedData = CryptoJS.AES.encrypt(base64, key).toString();

  // Clear preview
  preview.src = "";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("status").textContent =
    "Image Encrypted! Enter decrypt key to restore.";

  // Show popup
  decryptPopup.style.display = "flex";
}

// Decrypt image
function decryptImage() {
  let decryptKey = document.getElementById("decryptKeyInput").value;
  if (!decryptKey) {
    alert("Enter decrypt key");
    return;
  }
  if (!encryptedData) {
    alert("No encrypted image!");
    return;
  }

  try {
    let bytes = CryptoJS.AES.decrypt(encryptedData, decryptKey);
    let decryptedBase64 = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedBase64) {
      alert("Wrong key! Decryption failed.");
      return;
    }

    let img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      preview.src = canvas.toDataURL();
      document.getElementById("status").textContent =
        "Image Decrypted Successfully!";
    };
    img.src = decryptedBase64;

    // Close popup
    decryptPopup.style.display = "none";
    document.getElementById("decryptKeyInput").value = "";
  } catch (err) {
    alert("Decryption failed! Wrong key?");
  }
}

// Download image
function downloadImage() {
  if (!preview.src) {
    alert("No image to download");
    return;
  }
  let link = document.createElement("a");
  link.download = "image.png";
  link.href = preview.src;
  link.click();
  document.getElementById("status").textContent = "Image Downloaded!";
}
