// // server.js
// const express = require('express');
// const { Router } = require('mikronode');
// const WebSocket = require('ws');

// const app = express();
// const PORT = 3001;
// const WS_PORT = 3002;
// let latestData = [];

// const wss = new WebSocket.Server({ port: WS_PORT });

// async function fetchDataFromMikroTik() {
//   try {
//     const connection = new Router('192.168.56.2', '8728');
//     await connection.connect();
//     const channel = connection.openChannel();
//     channel.write('/interface/print');
    
//     channel.on('done', (data) => {
//       latestData = Router.parseItems(data);
//       connection.close();

//       // Kirim data terbaru ke semua client WebSocket
//       wss.clients.forEach(client => {
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(JSON.stringify(latestData));
//         }
//       });
//     });
//   } catch (error) {
//     console.error('Gagal menyinkronkan data:', error);
//   }
// }

// setInterval(fetchDataFromMikroTik, 5000);

// app.listen(PORT, () => {
//   console.log(`Server API berjalan di http://localhost:${PORT}`);
// });

// server.js
// const express = require('express');
// const WebSocket = require('ws');
// const { Router } = require('mikronode'); // pastikan mikronode terpasang
// const app = express();
// const API_PORT = 3001;  // Port untuk REST API
// const WS_PORT = 3002;   // Port untuk WebSocket

// let latestData = [];

// // Setup REST API server
// app.get('/monitor', (req, res) => {
//   res.json(latestData); // Kirim data terbaru ke klien yang mengakses endpoint /monitor
// });

// app.listen(API_PORT, () => {
//   console.log(`Server API berjalan di http://localhost:${API_PORT}`);
// });

// // Setup WebSocket server
// const wss = new WebSocket.Server({ port: WS_PORT });
// console.log(`WebSocket server berjalan di ws://localhost:${WS_PORT}`);

// // Fungsi untuk mengambil data dari MikroTik dan memperbarui cache data terbaru
// async function fetchDataFromMikroTik() {
//   try {
//     const connection = new Router('192.168.56.2', '8728'); // Ganti IP dan port sesuai dengan konfigurasi MikroTik
//     await connection.connect();
//     const channel = connection.openChannel();
//     channel.write('/interface/print');
    
//     channel.on('done', (data) => {
//       latestData = Router.parseItems(data); // Update cache dengan data terbaru
//       connection.close();

//       // Kirim data terbaru ke semua klien WebSocket yang terhubung
//       wss.clients.forEach(client => {
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(JSON.stringify(latestData));
//         }
//       });
//     });
//   } catch (error) {
//     console.error('Gagal menyinkronkan data:', error);
//   }
// }

// // Jalankan fungsi fetchDataFromMikroTik setiap 5 detik
// setInterval(fetchDataFromMikroTik, 5000);\

const MikroNode = require('mikronode-ng'); // Pastikan menggunakan mikronode-ng
const express = require('express');
const WebSocket = require('ws');
const app = express();
const API_PORT = 3001;
const WS_PORT = 3002;

let latestData = [];

// Setup REST API server
app.get('/monitor', (req, res) => {
  res.json(latestData);
});

app.listen(API_PORT, () => {
  console.log(`Server API berjalan di http://localhost:${API_PORT}`);
});

// Setup WebSocket server
const wss = new WebSocket.Server({ port: WS_PORT });
console.log(`WebSocket server berjalan di ws://localhost:${WS_PORT}`);

async function fetchDataFromMikroTik() {
  try {
    const connection = MikroNode.getConnection('192.168.56.2', '8728', 'username', 'password');
    await connection.connect();
    const channel = connection.openChannel();
    channel.write('/interface/print');

    channel.on('done', (data) => {
      latestData = MikroNode.parseItems(data);
      connection.close();

      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(latestData));
        }
      });
    });
  } catch (error) {
    console.error('Gagal menyinkronkan data:', error);
  }
}

setInterval(fetchDataFromMikroTik, 5000);