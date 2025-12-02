# TripSecure - Smart Tourist Safety Platform

TripSecure is a comprehensive safety platform designed to keep travelers secure during their journeys. The application provides real-time monitoring, smart alerts, priority member management, and community-driven safety features.

## 🌟 Features

### Core Safety Features
- **Real-time Location Tracking** - Advanced GPS monitoring with geofencing
- **Smart Alert System** - Instant notifications for risky areas and emergencies
- **Priority Members** - Connect with up to 3 priority members for safety monitoring
- **Risk Area Detection** - Automatic alerts when entering high-risk zones
- **Emergency Response** - Direct integration with police and travel departments

### User Experience
- **Dark/Light Mode** - Beautiful theme switching with smooth transitions
- **Page Transitions** - Elegant book-opening animations between pages
- **Responsive Design** - Works seamlessly on all devices
- **Modern UI** - Clean, intuitive interface with accessibility in mind


* 🧩 **Hardhat Ethereum Blockchain** – KYC identity verification
* 🖥️ **Node.js Backend API** – Business logic + DB + blockchain interaction
* 📱 **Expo React Native Mobile App** – Tourist application
* 🌐 **React Web App** – Admin & service-provider portal

---

# 🚀 Tech Stack

| Layer          | Technology                                                         |
| -------------- | ------------------------------------------------------------------ |
| **Blockchain** | Hardhat, Solidity, Local Ethereum Node                             |
| **Backend**    | Node.js, Express, MongoDB, ethers.js |
| **Mobile App** | Expo + React Native                                                |
| **Web App**    | React + Vite                                                  |
| **Dev Tools**  | Docker, npm, Git, VS Code                                          |

---

# 📦 Project Structure

```
TripSecure/
│
├── backend/               # Node.js backend API
│   ├── src/
│   └── package.json
│
├── blockchain/            # Hardhat blockchain workspace
│   ├── contracts/
│   ├── scripts/
│   └── hardhat.config.js
│
├── smart-tourist-mobile/  # Expo React Native App
│   ├── app/
│   └── package.json
│
├── webService/            # React Web App
│   ├── src/
│   └── package.json

```

---

# ⚙️ Installation & Setup

Clone the repository:

```bash
git clone <https://github.com/Kavya7089/TripSecure>
cd TripSecure
```

---

# 🔗 1. Start Blockchain (Hardhat)

```
cd blockchain
npm install
npx hardhat node
```

This starts a **local Ethereum network** at:

```
http://127.0.0.1:8545/
```

Deploy your contract (optional):

```
npx hardhat run scripts/deploy.js --network localhost
```

---

# 🖥️ 2. Start Backend (Node.js)

```
cd backend
npm install
npm run dev
```

Backend communicates with Hardhat using `ethers.js` for KYC verification.

---

# 📱 3. Start Mobile App (Expo)

```
cd smart-tourist-mobile
npm install
npx expo start
```

Supports both:

* Android Emulator
* iOS Simulator
* Expo Go on real device

---

# 🌐 4. Start Web App (React)

```
cd webService
npm install
npm run dev
```

---

# 🔐 Key Features

### 🛂 Blockchain-Based KYC

* User identity stored on Ethereum smart contracts
* Immutable and tamper-proof verification
* Frontend + backend connected via blockchain events

### 🧭 Tourist Mobile App (Expo)

* Traveler registration
* KYC submission & verification
* Travel safety dashboard
* Emergency contact access

### 🛠️ Admin Web Portal (React)

* KYC approval dashboard
* Manage tourists & service providers
* View analytics & logs

### 🔌 Backend API (Node.js)

* REST APIs for mobile & web
* Interacts with smart contracts
* Token-based user authentication
* Stores verified identity mapping

---

# 🧪 Environment Variables

Create a `.env` inside **backend**:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
BLOCKCHAIN_RPC=http://127.0.0.1:8545
PRIVATE_KEY=<hardhat-account-private-key>
```

---

# 🏛️ Blockchain Contract Example

```
blockchain/
└── contracts/
    └── KYC.sol
```

Smart contract handles:

* storeKYC()
* verifyUser()
* getUserStatus()

---

# 📸 Screenshots

You may insert UI screenshots or architecture diagrams here.

---

# 🚧 Future Enhancements

* QR-based tourist identity verification
* Government integration API
* Multi-chain support (Polygon, Base, Solana)
* On-chain travel insurance

---

# 🤝 Contributing

1. Fork the repo
2. Create a new branch
3. Commit your changes
4. Open a pull request


