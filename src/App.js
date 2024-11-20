import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
    const [interfaces, setInterfaces] = useState([]);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState("");

    // useEffect(() => {
    //     // Ambil data dari API
    //     axios
    //         .get("http://localhost:5000/api/interfaces") // Ganti dengan URL API Anda
    //         .then((response) => {
    //             setInterfaces(response.data);
    //         })
    //         .catch((err) => {
    //             setError("Gagal mengambil data dari API.");
    //         });
    // }, []);
    const fetchData = async () => {
      try {
          const response = await axios.get("http://localhost:5000/api/interfaces"); // Ganti URL sesuai backend Anda
          setInterfaces(response.data);
          setError(""); // Reset error jika sebelumnya ada
          setLastUpdated(new Date().toLocaleDateString());
      } catch (err) {
          console.error(err);
          setError("Gagal mengambil data dari API.");
      }
  };

  // Jalankan fetchData secara periodik
  useEffect(() => {
      fetchData(); // Ambil data pertama kali

      const intervalId = setInterval(fetchData, 1000); // Ambil data setiap 5 detik

      return () => clearInterval(intervalId); // Bersihkan interval saat komponen unmount
  }, []);

    return (
        <div className="container">
            <h1 className="title">Mikrotik Interfaces</h1>
            {error && <p className="error">{error}</p>}
            {interfaces.length > 0 ? (
               <div className="table-container">
                <table className="simple-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>MAC Address</th>
                            <th>MTU</th>
                            <th>Running</th>
                            <th>RX Bytes</th>
                            <th>TX Bytes</th>
                            <th>Last Link Up Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {interfaces.map((iface, index) => (
                            <tr key={index}>
                                <td>{iface[".id"]}</td>
                                <td>{iface.name}</td>
                                <td>{iface["mac-address"]}</td>
                                <td>{iface.mtu}</td>
                                <td>{iface.running ? "Yes" : "No"}</td>
                                <td>{iface["rx-byte"]}</td>
                                <td>{iface["tx-byte"]}</td>
                                <td>{iface["last-link-up-time"]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>  
            ) : (
                <p className="no-data">Tidak ada data untuk ditampilkan.</p>
            )}
        </div>
    );
};

export default App;
