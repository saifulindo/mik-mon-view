import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
    const [interfaces, setInterfaces] = useState([]);
    const [error, setError] = useState("");

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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Mikrotik Interfaces</h1>
            {error && <p className="text-red-500">{error}</p>}
            {interfaces.length > 0 ? (
                <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">ID</th>
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">MAC Address</th>
                            <th className="border border-gray-300 px-4 py-2">MTU</th>
                            <th className="border border-gray-300 px-4 py-2">Running</th>
                            <th className="border border-gray-300 px-4 py-2">RX Bytes</th>
                            <th className="border border-gray-300 px-4 py-2">TX Bytes</th>
                            <th className="border border-gray-300 px-4 py-2">Last Link Up Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {interfaces.map((iface, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-4 py-2">{iface[".id"]}</td>
                                <td className="border border-gray-300 px-4 py-2">{iface.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{iface["mac-address"]}</td>
                                <td className="border border-gray-300 px-4 py-2">{iface.mtu}</td>
                                <td className="border border-gray-300 px-4 py-2">{iface.running ? "Yes" : "No"}</td>
                                <td className="border border-gray-300 px-4 py-2">{iface["rx-byte"]}</td>
                                <td className="border border-gray-300 px-4 py-2">{iface["tx-byte"]}</td>
                                <td className="border border-gray-300 px-4 py-2">{iface["last-link-up-time"]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500">Tidak ada data untuk ditampilkan.</p>
            )}
        </div>
    );
};

export default App;
