import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
    const [interfaces, setInterfaces] = useState([]);
    const [dhcpClients, setDhcpClients] = useState([]);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState("");
    const [routes, setRoutes] = useState([]);
    const [ipAddresses, setIpAddresses] = useState([]);

    // State untuk IP yang sedang diedit
    const [editingIp, setEditingIp] = useState(null);
    const [formData, setFormData] = useState({
        address: "",
        interface: "",
        disabled: false,
        dynamic: false,
        network: "",
    });

    // Ambil data Interfaces
    const fetchInterfaces = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/interfaces");
            setInterfaces(response.data);
            setError(""); // Reset error jika ada
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

    // Ambil data Routes
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

    // Ambil data IP Addresses
    const fetchIpAddresses = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/address");
            setIpAddresses(response.data); // Simpan data IP Address
            setError("");
        } catch (err) {
            console.error(err);
            setError("Gagal mengambil data IP Address.");
        }
    };

    // Update IP Address
    const updateIpAddress = async (id) => {
        console.log("Updating IP with ID:", id);
        console.log("Sending data to server:", formData);
        try {
            const response = await axios.patch(`http://localhost:5000/api/address/${id}`, formData);
            console.log("Server response:", response.data);

            // Update IP address di state
            setIpAddresses((prev) =>
                prev.map((ip) => (ip[".id"] === id ? { ...ip, ...formData } : ip))
            );
            await fetchIpAddresses(); // Refresh data
            setEditingIp(null); // Keluar dari mode edit
            setFormData({
                address: "",
                interface: "",
                disabled: false,
                dynamic: false,
                network: "",
            });
            setError(""); // Reset error
        } catch (err) {
            console.error(err);
            setError("Gagal mengupdate IP Address.");
        }
    };

    // Fungsi untuk memulai mode edit IP Address
    const handleEdit = (ip) => {
        setEditingIp(ip[".id"]);
        setFormData({
            address: ip.address,
            interface: ip["interface"],
            disabled: ip.disabled,
            dynamic: ip.dynamic,
            network: ip.network,
        });
    };

    // Fungsi untuk membatalkan edit
    const handleCancelEdit = () => {
        setEditingIp(null);
        setFormData({
            address: "",
            interface: "",
            disabled: false,
            dynamic: false,
            network: "",
        });
    };

    // Fungsi untuk menangani perubahan data input
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Fetch data secara periodik
    useEffect(() => {
        const fetchData = () => {
            fetchInterfaces();
            fetchDhcpClients();
            fetchRoutes();
            fetchIpAddresses();
        };

        fetchData(); // Ambil data pertama kali
        const intervalId = setInterval(fetchData, 5000); // Refresh data setiap 5 detik

        return () => clearInterval(intervalId); // Bersihkan interval saat komponen unmount
    }, []);

    return (
        <div className="container">
            <h1 className="title">Mikrotik Monitoring</h1>
            <h2>Interfaces</h2>
            {error && <p className="error">{error}</p>}
            {/* Tabel Interfaces */}
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
                        {/* <th>Interface</th> */}
                        <th>Distance</th>
                        <th>Active</th>
                        <th>Scope</th>
                        <th>Target Scope</th>
                    </tr>
                  </thead>
                <tbody>
                {routes.map((route, index) => (
                    <tr key={index}>
                        <td>{route[".id"]}</td>
                        <td>{route["dst-address"]}</td>
                        <td>{route.gateway}</td>
                        {/* <td>{route.interface}</td> */}
                        <td>{route.distance}</td>
                        <td>{route.active ? "Yes" : "No"}</td>
                        <td>{route.scope}</td>
                        <td>{route["target-scope"]}</td>
                    </tr>
                ))}
               </tbody>
            </table>
        </div>
        ) : (
               <p className="no-data">Tidak ada data route untuk ditampilkan.</p>
        )}
             <h2>IP Addresses</h2>
             {ipAddresses.length > 0 ? (
                <div className="table-container">
                    <table className="simple-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Actual Interface</th>
                                <th>Address</th>
                                <th>Disabled</th>
                                <th>Dynamic</th>
                                <th>Network</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ipAddresses.map((ip, index) => (
                                <tr key={index}>
                                    <td>{ip[".id"]}</td>
                                    <td>{ip["actual-interface"]}</td>
                                    <td>{ip.address}</td>
                                    <td>{ip.disabled ? "Yes" : "No"}</td>
                                    <td>{ip.dynamic ? "Yes" : "No"}</td>
                                    <td>{ip.network}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="no-data">Tidak ada data IP Address untuk ditampilkan.</p>
            )}
            {/* Tabel IP Addresses */}
            <h2>IP Addresses</h2>
            {ipAddresses.length > 0 ? (
                <div className="table-container">
                    <table className="simple-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Interface</th>
                                <th>Address</th>
                                <th>Disabled</th>
                                <th>Dynamic</th>
                                <th>Network</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ipAddresses.map((ip) =>
                                editingIp === ip[".id"] ? (
                                    <tr key={ip[".id"]}>
                                        <td>{ip[".id"]}</td>
                                        <td>
                                            <input
                                                type="text"
                                                name="interface"
                                                value={formData.interface}
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name="disabled"
                                                checked={formData.disabled}
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name="dynamic"
                                                checked={formData.dynamic}
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="network"
                                                value={formData.network}
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => updateIpAddress(ip[".id"])}>Save</button>
                                            <button onClick={handleCancelEdit}>Cancel</button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={ip[".id"]}>
                                        <td>{ip[".id"]}</td>
                                        <td>{ip["interface"]}</td>
                                        <td>{ip.address}</td>
                                        <td>{ip.disabled ? "Yes" : "No"}</td>
                                        <td>{ip.dynamic ? "Yes" : "No"}</td>
                                        <td>{ip.network}</td>
                                        <td>
                                            <button onClick={() => handleEdit(ip)}>Edit</button>
                                        </td>
                                    </tr>
                                )
                            )}
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
