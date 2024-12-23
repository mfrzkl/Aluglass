# Aluglass

Aluglass is an application designed to streamline the management of sales orders (SO), delivery orders (DO), inventory, and shipment tracking for glass and aluminum products.

## Features
- **Sales Order Management:**
  - Record customer orders, including order numbers, dates, customer details, and product specifics (quantity, color, thickness, dimensions, and price).
- **Delivery Order Tracking:**
  - Monitor delivery statuses and generate delivery reports.
- **Inventory Control:**
  - Manage stock levels, view inventory details, and track product availability.
- **Shipment Monitoring:**
  - Track shipments and update their statuses in real time.

## Technical Highlights
- **Technology Stack:**
  - Backend: Node.js
  - Authentication: OAuth (Google and GitHub), JWT
  - Data Handling: RabbitMQ for message queuing (Aluglass version)
  - Deployment: Docker support with `docker-compose.yaml`
  - Database: Supports migrations and organized data handling
- **Security Features:**
  - SSL certificates for secure communication
  - Rate limiting using `express-rate-limit`

## Getting Started
### Prerequisites
- Node.js and npm installed
- Docker (optional for Docker-based deployment)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
#### Using Node.js:
```bash
node server.js
```

#### Using Docker:
```bash
docker-compose up
```

## Directory Structure
- `public/`: Static files and assets
- `services/`: Microservices for handling various business processes
- `ssl/`: SSL certificates for secure communication
- `migrations/`: Database migration scripts
- `db/`: Database-related configurations

## Contributing
1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add feature'
   ```
4. Push the branch and open a Pull Request.

## License
This project is licensed under the MIT License - see the `LICENSE` file for details.
