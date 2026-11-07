# AI Support Ticket Automation System



An AI-powered customer support ticket management system that uses Google's Gemini API to automatically classify support requests, assess their priority and customer sentiment, and generate suggested responses for support agents.



## Project Overview



Customer support teams often handle large volumes of incoming requests. Manually reviewing, categorizing, and prioritizing every ticket can be time-consuming.



This project aims to streamline that process through AI-assisted ticket analysis and a centralized support dashboard.



When a customer submits a ticket, the system sends its subject and message to the Gemini API. The AI analyzes the request and returns a structured response containing its category, priority, sentiment, and a suggested reply. The ticket and its AI-generated analysis are then stored in a MariaDB database for support agents to review.



\*\*This is an ongoing personal portfolio project.\*\* The current version implements the core AI ticket-processing workflow, with additional automation and reporting capabilities planned.



## Key Features



### Implemented



\*\*Support Ticket Submission:\*\* Submit customer support requests with customer name, email, subject, and message.

\- \*\*AI Ticket Classification:\*\* Automatically classify tickets into Technical Issue, Billing, Account Access, or General Inquiry.

\- \*\*Priority Assessment:\*\* Assign Low, Medium, High, or Critical priority levels.

\- \*\*Sentiment Analysis:\*\* Identify Positive, Neutral, or Negative customer sentiment.

\- \*\*Suggested Reply Generation:\*\* Generate professional AI-assisted responses for support agents to review.

\- \*\*Database Persistence:\*\* Store submitted tickets and AI analysis in MariaDB.

\- \*\*Support Dashboard:\*\* View submitted tickets and their AI-generated classifications.

\- \*\*Ticket Status Management:\*\* Update ticket status between Open, In Progress, and Resolved.

\- \*\*REST API:\*\* Backend endpoints for health checks, ticket submission, retrieval, and status updates.



### Planned Enhancements



\- Search and filtering by customer, category, priority, sentiment, and status.

\- Improved ticket details and dashboard interface.

\- Loading indicators and more robust AI error handling.

\- Automated ticket assignment and routing.

\- Analytics and reporting dashboard.

\- AI processing logs and monitoring.

\- Human review and approval workflow.

\- Automated testing and additional input validation.



## Stakeholders



| Stakeholder | Role |

|---|---|

| Customer | Submits support requests |

| Customer Support Agent | Reviews AI analysis, suggested replies, and manages ticket status |

| Support Manager | Monitors ticket volume, priority, and customer sentiment |



The primary user of the dashboard is the customer support agent. AI-generated recommendations are intended to assist agents, not replace human judgment.



## Technology Stack



| Layer | Technologies |

|---|---|

| Frontend | Next.js, React, Tailwind CSS |

| Backend | Node.js, Express.js |

| AI Integration | Google Gemini API, `@google/genai` |

| Database | MariaDB / MySQL |

| Database Driver | `mysql2` |

| Development Tools | Nodemon, ESLint |


## Application Workflow



1\. A customer submits a support ticket through the application.

2\. The Express backend validates the required fields.

3\. The ticket subject and message are sent to the Google Gemini API.

4\. Gemini analyzes the ticket and returns structured JSON containing:

&#x20;  - Category

&#x20;  - Priority

&#x20;  - Sentiment

&#x20;  - Suggested reply

5\. The backend stores the ticket and AI analysis in MariaDB.

6\. The support dashboard retrieves and displays the ticket information.

7\. A support agent reviews the AI-generated recommendation and updates the ticket status.



## Project Structure



```text

ai-support-ticket-automation/

│

├── backend/

│   ├── config/

│   │   └── db.js

│   ├── services/

│   │   └── aiService.js

│   ├── .env.example

│   ├── package.json

│   └── server.js

│

├── frontend/

│   ├── app/

│   ├── public/

│   └── package.json

│

├── screenshots/

│

├── .gitignore

└── README.md

```



## Getting Started



### Prerequisites



\- Node.js and npm

\- XAMPP or another MariaDB/MySQL server

\- Google Gemini API key

\- Git



\### 1. Clone the repository



```bash

git clone https://github.com/AnikaTabassumm/AI-Support-Ticket-Automation-System.git

cd ai-support-ticket-automation

```



### 2. Set up the database



Start Apache (if needed) and MySQL/MariaDB through XAMPP.



Create a database named:



```sql

CREATE DATABASE ai\_support\_automation;

```



The application expects a `tickets` table containing the following fields:



\- `id`

\- `customer\_name`

\- `email`

\- `subject`

\- `message`

\- `category`

\- `priority`

\- `sentiment`

\- `suggested\_reply`

\- `status`

\- `created\_at`



Make sure the table has an auto-incrementing ID, a default status of `Open`, and a creation timestamp.



### 3. Configure the backend



```bash

cd backend

npm install

```



Create your local environment file from the example:



\*\*Windows CMD:\*\*



```cmd

copy .env.example .env

```



Configure the variables in `backend/.env`:



```env

PORT=5000



DB\_HOST=localhost

DB\_USER=root

DB\_PASSWORD=

DB\_NAME=ai\_support\_automation



GEMINI\_API\_KEY=your\_gemini\_api\_key

GEMINI\_MODEL=your\_available\_gemini\_model

```



Replace the placeholder values with your own local database credentials and Gemini API configuration.



Start the backend:



```bash

npm run dev

```



The backend runs at:



`http://localhost:5000`



### 4. Set up the frontend



Open another terminal:



```bash

cd frontend

npm install

npm run dev

```



Open the application at:



`http://localhost:3000`



## API Endpoints



| Method | Endpoint | Description |

|---|---|---|

| GET | `/api/health` | Check backend and database connectivity |

| POST | `/api/tickets` | Submit and analyze a support ticket |

| GET | `/api/tickets` | Retrieve all support tickets |

| PATCH | `/api/tickets/:id/status` | Update a ticket's status |



### Ticket Submission Example



\*\*POST\*\* `/api/tickets`



Request body:



```json

{

&#x20; "customer\_name": "Alex Morgan",

&#x20; "email": "alex@example.com",

&#x20; "subject": "Payment deducted but order not confirmed",

&#x20; "message": "My payment was deducted, but my order is still showing as unpaid. Please investigate."

}

```



The response includes the saved ticket and its AI-generated category, priority, sentiment, and suggested reply.



## Screenshots



Application screenshots will be added here as the project interface develops.



## Current Limitations



\- AI processing depends on the availability and response time of the Gemini API.

\- Suggested replies are generated for human review; the system does not automatically send customer emails.

\- Authentication and role-based access control are not implemented yet.

\- Advanced ticket routing, analytics, and monitoring are planned enhancements.



## Future Development



The project will continue evolving toward a more comprehensive AI-assisted support operations platform, with automated ticket routing, analytics, improved error handling, monitoring, and human-in-the-loop review.



## Author



Developed as a personal portfolio project to explore AI integration, API development, workflow automation, and full-stack application development.

