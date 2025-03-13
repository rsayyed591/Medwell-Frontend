# Medwell-Frontend V1

Medwell-Frontend is a modern, user-friendly web application designed to help patients and healthcare providers manage and visualize medical reports and data efficiently.

## Features

- **Report Management**: View and manage medical reports in a clean, intuitive interface.
- **Detailed Report View**: Access comprehensive information for each report, including test results and summaries.
- **PDF Generation**: Generate and download professionally formatted PDF reports.
- **Interactive UI**: Enjoy a responsive and animated user interface built with React.
- **Modal View**: View full reports in a modal window for a focused reading experience.

## Technologies Used

- React
- JavaScript
- Tailwind CSS
- Framer Motion (for animations)
- jsPDF (for PDF generation)
- react-modal

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/vnrr2023/Medwell-Frontend.git
   cd Medwell-Frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` to view the application.

## Project Structure

- `/public`: Static assets
  - Images: Stethoscope.png, hero.jpg, medwell.png, patient.png, vite.svg

- `/src`: Main application code
  - `/assets`: Additional assets (contents not shown)
  - `/components`
    - `/ui`: Reusable UI components (e.g., input.jsx)
    - General components: About.jsx, Dashboard.jsx, Hero.jsx, Login.jsx, Pricing.jsx, Sidebars.jsx, SignUp.jsx
  - `/pages`
    - `/Patient`: Patient-related components
      - AddReport.jsx, Appointments.jsx, ExpenseTracker.jsx, HealthCheck.jsx, Profile.jsx, Reports.jsx, ShareWithDoctor.jsx, SharedComponents.jsx
  - `/utils`: Utility functions and helpers
    - cn.js, global.js
  - App.css: Main application styles
  - App.jsx: Main application component
  - index.css: Global styles
  - main.jsx: Application entry point

- Configuration files in the root directory:
  - .gitignore: Git ignore file
  - README.md: Project documentation
  - eslint.config.js: ESLint configuration
  - index.html: HTML entry point
  - netlify.toml: Netlify deployment configuration
  - package.json & package-lock.json: Node.js dependencies and lock file
  - postcss.config.js: PostCSS configuration
  - tailwind.config.js: Tailwind CSS configuration
  - vercel.json: Vercel deployment configuration
  - vite.config.js: Vite build tool configuration

## Usage

1. **Viewing Reports**: On the main page, you'll see a list of available reports. Click on any report to view its details.

2. **Detailed Report View**: In the detailed view, you can see the report summary, test results, and other relevant information.

3. **Downloading Reports**: Click the "Download PDF" button to generate and download a PDF version of the report.

4. **Viewing Full Report**: Click the "View Full Report" button to open a modal with the complete report content.

## Customization

- To add new report types or fields, update the `mockReports` array in `Reports.jsx`.
- Modify the PDF generation logic in the `handleDownloadPDF` function within `Reports.jsx` to change the PDF layout or content.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/) for the UI library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for the animation library
- [jsPDF](https://github.com/MrRio/jsPDF) for PDF generation
- [react-modal](https://github.com/reactjs/react-modal) for the modal component


## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository at https://github.com/vnrr2023/Medwell-Frontend.
