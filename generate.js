document.getElementById('qr-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const notes = document.getElementById('notes').value.trim();
  
    const data = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nNotes: ${notes}`;
  
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = '';
  
    QRCode.toCanvas(document.createElement('canvas'), data, { width: 200 }, (err, canvas) => {
      if (err) {
        console.error(err);
        return;
      }
      qrContainer.appendChild(canvas);
  
      // Make it downloadable
      const downloadLink = document.getElementById('download-btn');
      downloadLink.href = canvas.toDataURL();
      downloadLink.style.display = 'inline-block';
    });
  });
  