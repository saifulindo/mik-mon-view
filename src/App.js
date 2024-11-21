import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
    const [interfaces, setInterfaces] = useState([]);
    const [dhcpClients, setDhcpClients] = useState([]);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState("");
    const [routes, setRoutes] = useState([]);

    const fetchInterfaces = async () => {
      try {
          const response = await axios.get("http://localhost:5000/api/interfaces"); 
          setInterfaces(response.data);
          setError(""); // Reset error jika sebelumnya ada
          setLastUpdated(new Date().toLocaleDateString());
      } catch (err) {
          console.error(err);
          setError("Gagal mengambil data dari API.");
      }
  };

    // Ambil data DHCP Clients
    const fetchDhcpClients = async () => {
      try {
          const response = await axios.get("http://localhost:5000/api/dhcp-clients");
          setDhcpClients(response.data);
      } catch (err) {
          console.error(err);
          setError("Failed to fetch DHCP clients.");
      }
  };

  const fetchRoutes = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/routes");
        setRoutes(response.data);
        setError(""); // Reset error jika ada
    } catch (err) {
        console.error(err);
        setError("Gagal mengambil data Routes.");
    }
};

  // Jalankan fetchData secara periodik
  useEffect(() => {
      const fetchData = () => {
        fetchInterfaces();
        fetchDhcpClients();
        fetchRoutes();
      } // Ambil data pertama kali

      fetchData();
      const intervalId = setInterval(fetchData, 5000); // Ambil data setiap 5 detik

      return () => clearInterval(intervalId); // Bersihkan interval saat komponen unmount
  }, []);

    return (
        <div className="container">
            <h1 className="title">Mikrotik Monitoring</h1>
            <h2>Interfaces</h2>
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

            {/* Tabel DHCP Clients */}
            <h2>DHCP Clients</h2>
            {dhcpClients.length > 0 ? (
                <div className="table-container">
                    <table className="simple-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Address</th>
                                <th>Interface</th>
                                <th>Gateway</th>
                                <th>Status</th>
                                <th>Primary DNS</th>
                                <th>Expires After</th>
                                <th>DHCP Server</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dhcpClients.map((client, index) => (
                                <tr key={index}>
                                    <td>{client[".id"]}</td>
                                    <td>{client.address}</td>
                                    <td>{client.interface}</td>
                                    <td>{client.gateway}</td>
                                    <td>{client.status}</td>
                                    <td>{client["primary-dns"] || "N/A"}</td>
                                    <td>{client["expires-after"] || "N/A"}</td>
                                    <td>{client["dhcp-server"] || "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="no-data">No DHCP clients to display.</p>
            )}
            <h2>Routes</h2>
            {routes.length > 0 ? (
            <div className="table-container">
                <table className="simple-table">
                  <thead>
                    <tr>
                        <th>ID</th>
                        <th>Destination Address</th>
                        <th>Gateway</th>
                        <th>Interface</th>
                        <th>Distance</th>
                        <th>Active</th>
                    </tr>
                  </thead>
                <tbody>
                {routes.map((route, index) => (
                    <tr key={index}>
                        <td>{route[".id"]}</td>
                        <td>{route["dst-address"]}</td>
                        <td>{route.gateway}</td>
                        <td>{route.interface}</td>
                        <td>{route.distance}</td>
                        <td>{route.active ? "Yes" : "No"}</td>
                    </tr>
                ))}
               </tbody>
            </table>
        </div>
        ) : (
               <p className="no-data">Tidak ada data route untuk ditampilkan.</p>
        )}
        </div>
    );
};

export default App;
