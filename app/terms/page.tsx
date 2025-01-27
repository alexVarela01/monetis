'use client';

import Image from 'next/image';
import Link from 'next/link';
import "./styles.css";
import logoImage from '@/public/Logo.png'

export default function Terms() {
  return (
    <div className='termsContainer'>

      <Link href="/" className='logo'><Image src={logoImage} alt="Register"></Image></Link>

      <div className="content">
        <h2>Terms and Conditions for Testing and Test Automation</h2>
        <h2>Effective Date: January 26, 2025</h2>
        <p>Welcome to MONETIS. By using this application, you agree to comply with the following terms and conditions. These terms apply only to users testing the application and its functionalities as part of the test automation process.</p>

        <h2>1. Purpose of Use</h2>
        <p>This application is provided solely for testing and automation purposes. By accessing and using the application, you acknowledge that you are participating in a controlled testing environment. The purpose of this testing is to evaluate the functionality, performance, and usability of the application, including the behavior of test automation scripts.</p>

        <h2>2. Test Automation Disclaimer</h2>
        <p>The application may be subject to automated test interactions. These interactions are designed for the sole purpose of evaluating system performance and testing various features. These automated interactions will not result in any personal data being collected or processed beyond the scope of the testing environment.</p>

        <h2>3. Limitations of Liability</h2>
        <p>As a testing participant, you understand that this application is in the testing phase and may experience bugs, crashes, and other issues. We do not assume responsibility for any disruptions, damages, or losses that may occur while using the application.</p>

        <h2>4. User Data</h2>
        <p>No personal or sensitive data will be collected during testing, and any data entered is used solely for the purpose of evaluating the application&apos;s performance and behavior. Any data you input will not be stored beyond the testing environment.</p>

        <h2>5. Modifications</h2>
        <p>We reserve the right to modify these terms and conditions at any time. Any changes will be effective upon posting the updated terms on the application.</p>

        <h2>6. Acceptance of Terms</h2>
        <p>By participating in this testing process, you agree to these Terms and Conditions. If you do not agree with these terms, please refrain from using the application.</p>

        <h2>7. Contact Information</h2>
        <p>If you have any questions or concerns about these terms, please contact us at varela.alexandre01.random@gmail.com</p>
      </div>
    </div>
  );
}

