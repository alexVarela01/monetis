'use client';

import { useEffect, useState } from 'react';
import "./page.css";
import HomeNavigation from '../Components/HomeNavigation/HomeNavigation';
import logoImage from '@/public/Logo_white.png';
import Image from 'next/image';
import { LuRefreshCw, LuTestTubeDiagonal, LuWebhook } from 'react-icons/lu';
import { BiBook, BiInfoCircle, BiShield, BiUpArrowAlt } from 'react-icons/bi';


export default function About() {
  const curYear = new Date().getFullYear();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.title = 'MONETIS | About';
  }, []);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function scrollAnchor(anchor: string) {
    const element = document.getElementById(anchor);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  }

  return (
    <>
      <HomeNavigation/>
      <div className='docContainer'>
        <div className='mainSection'>
          <LuTestTubeDiagonal/>
          <h1>Testing Documentation</h1>
          <p>Complete guide for automated testing with MONETIS</p>
        </div>

        <div className='infoSection'>
          
          <div className='infoContainer'>

            <div className='info index'>
              <div onClick={() => scrollAnchor("endpoints")}>Testing Endpoints</div>
              <div onClick={() => scrollAnchor("cleanup")}>Data Cleanup</div>
              <div onClick={() => scrollAnchor("bestpractices")}>Best Practices</div>
              <div onClick={() => scrollAnchor("requirements")}>Functional Requirements</div>
            </div>

            <div id="endpoints" className="subTitle">
              <LuWebhook/>
              <h2>Testing Endpoints</h2>
            </div>

            <div className='info'>
              <div>
                <h3>Balance management</h3>
              </div>

              <div className="endpoint">
                <span className='post'>POST</span><code>/api/users/api/addMoney</code>
              </div>
              <p>Add money directly into the checking account</p>
              
              <h5>Headers (Account to add money)</h5>
              <pre>
{`x-username: testingaccount@eshkay.dev
x-password: thisIsMyPassword!1
`}
              </pre>

              <h5>Request body</h5>
              <pre>
{`{
    "amount": "10000",
}`}
              </pre>

              <hr />

              <div>
                <h3>Account management</h3>
              </div>

              <div className="endpoint">
                <span className='post'>POST</span><code>/api/users/register</code>
              </div>
              <p>Create a testing account</p>
              
              <h5>Request body</h5>
              <pre>
{`{
    "name": "Testing",
    "surname": "Account",
    "email": "testingaccount@eshkay.dev",
    "phone_number": "123123123", 
    "street_address": "Some Random street", 
    "postal_code": "1231-123", 
    "city": "Lisbon", 
    "country": "PT", 
    "password": "thisIsMyPassword!1", 
    "confirmPassword": "thisIsMyPassword!1"
}`}
              </pre>

              <div className="endpoint"style={{ marginTop: '10px' }}>
                <span className='delete'>DELETE</span><code>/api/users/api/deleteAccount</code>
              </div>
              <p>Delete a testing account and all related data (history, account, user)</p>
              <h5>Headers (Account to be deleted)</h5>
              <pre>
{`x-username: testingaccount@eshkay.dev
x-password: thisIsMyPassword!1
`}
              </pre>
              <hr />

               <div>
                <h3>Transactions</h3>
              </div>

              <div className="endpoint">
                <span className='get'>GET</span><code>/api/users/api/getIbanByEmail?email={"{email}"}</code>
              </div>
              <p>Retrieves the IBANs of all accounts associated with the target user using their email</p>
              
              <h5>Headers (Your account to access endpoint)</h5>
              <pre>
{`x-username: testingaccount@eshkay.dev
x-password: thisIsMyPassword!1
`}
              </pre>
            </div>

            <div id="cleanup" className="subTitle">
              <LuRefreshCw/>
              <h2>Data Cleanup</h2>
            </div>

            <div className='info'>
              <div>
                <h3>Automated Cleanup Process</h3>
              </div>

              <p>Currently, the system automatically cleans up all test data every 7 days</p>
              
              <div className='warning'>
                <BiShield/>
                <span>Important: Always use the delete endpoints after test execution to maintain a clean test environment.</span>
              </div>
              
              <div>
                <h3>Manual Delete Endpoint</h3>
              </div>

              <pre>
{`DELETE /api/users/api/deleteAccount

// Headers
// username and password 
// from account you want to delete
x-username: testingaccount@eshkay.dev
x-password: thisIsMyPassword!1
`}
              </pre>
            </div>

            <div id="bestpractices" className="subTitle">
              <BiBook/>
              <h2>Best Practices</h2>
            </div>

            <div className='info'>
            <div>
                <h3>Test User Management</h3>
              </div>

              <ul>
                <li>Create a new test user for each test execution</li>
                <li>Use meaningful prefixes for test emails (e.g., &quot;test_automation_&quot;)</li>
                <li>Delete test users after test execution completes</li>
              </ul>

              <div style={{ marginTop: '10px' }}>
                <h3>Data Isolation</h3>
              </div>

              <ul>
                <li>Use unique identifiers for test data to prevent conflicts</li>
                <li>Create dedicated test accounts for very specific test scenarios</li>
                <li>Clean up test data immediately after test execution</li>
              </ul>

              <div style={{ marginTop: '10px' }}>
                <h3>Test Execution & Stability</h3>
              </div>

              <ul>
                <li>Use explicit waits instead of arbitrary sleep timers to handle dynamic elements</li>
                <li>Run tests in parallel to speed up execution time</li>
                <li>Implement retry mechanisms for flaky tests instead of allowing false failures</li>
              </ul>
              
            </div>

            <div id="requirements" className="subTitle">
              <BiInfoCircle/>
              <h2>Functional Requirements</h2>
            </div>

            <div className='info'>
              <div>
                <h3>1. General Documentation</h3>
              </div>
              <p>
                This document outlines the expected functionalities and behaviors within MONETIS.
                It serves as a client-level reference detailing requirements, expected outcomes, and user actions for each feature. 
                This can be used as a baseline for testing.
              </p>

              <div style={{ marginTop: '15px' }}>
                <h3>2. Bank Accounts</h3>
              </div>

              <h4>2.1 IBAN Validation</h4>
              <ul>
                <li>The system must generate an IBAN based on the official country code and length requirements.</li>
                <li>The IBAN should always be displayed in the correct format wherever it appears.</li>
              </ul>

              <h4>2.2 Creating Accounts</h4>
              <ul>
                <li>Users must be able to create accounts via an intuitive interface.</li>
                <li>Required inputs: Account Name and initial deposit, multiple of 10.</li>
                <li>Each newly created account must have a unique IBAN.</li>
                <li>After creation, the account type will be &apos;User&apos;. See below for related actions.</li>
                <li>Each user can create up to six accounts.</li>
                <li>After creation, the account should be visible in the accounts list. Clicking on it should redirect the user to the details page, displaying account information and all related actions (see below).</li>
              </ul>

              <h4>2.3 Account actions (Checking)</h4>
              <ul>
                <li>Transfer – Redirects the user to the transfer page.</li>
                <li>History – Redirects the user to the transactions page.</li>
              </ul>

              <h4>2.4 Account actions (Savings)</h4>
              <ul>
                <li>Withdraw – Transfers money to the checking account.</li>
                <li>Top up – Transfers money from the checking account to this account.</li>
              </ul>

              <h4>2.5 Account actions (User)</h4>
              <ul>
                <li>Withdraw – Transfers money to the checking account.</li>
                <li>Top up – Transfers money from the checking account to this account.</li>
                <li>Edit – Allows the user to change the account name.</li>
                <li>Delete – Removes the account. Any available funds should be transferred to the checking account.</li>
              </ul>

              <div style={{ marginTop: '15px' }}>
                <h3>3. Transfers</h3>
              </div>

              <h4>3.1 Transfer to Another Account</h4>
              <ul>
                <li>Users must be able to transfer funds to other bank accounts.</li>
                <li>The system should verify that the user has sufficient funds before allowing the transfer.</li>
                <li>A confirmation step should be required before executing the transfer.</li>
                <li>The transfer should be logged in the transaction history.</li>
                <li>The account balance should be updated on both the sender and receiver accounts.</li>
              </ul>

              <h4>3.2 Transfer to Own Account</h4>
              <ul>
                <li>Users must be able to transfer funds between their own accounts.</li>
                <li>The system must update balances immediately upon successful transfer.</li>
                <li>The transfer should be logged in the transaction history.</li>
              </ul>

              <div style={{ marginTop: '15px' }}>
                <h3>4. Payments</h3>
              </div>

              <h4>4.1 General Payments</h4>
              <ul>
                <li>Payments are internal, meaning they do not interact with external systems, but they should still be recorded in the transaction history.</li>
                <li>Users should be able to enter payment details, including Entity, Reference, Category, and Amount.</li>
                <li>The system should ensure sufficient balance.</li>
                <li>The system should log payments with timestamps and category.</li>
              </ul>

              <div style={{ marginTop: '15px' }}>
                <h3>5. Settings</h3>
              </div>

              <h4>5.1 Change Settings</h4>
              <ul>
                <li>Users should be able to modify personal data related to the account.</li>
                <li>Changes should be reflected immediately upon saving.</li>
              </ul>

              <h4>5.2 Change Password</h4>
              <ul>
                <li>Users must be able to change their password securely.</li>
                <li>The system should enforce strong password policies.</li>
                <li>After changing the password, the user should be logged out.</li>
              </ul>

              <h4>5.3 Delete Account</h4>
              <ul>
                <li>Users should be able to request account deletion through settings.</li>
                <li>The confirmation process must be completed.</li>
                <li>Upon deletion, all user data should be removed.</li>
              </ul>

              <div style={{ marginTop: '15px' }}>
                <h3>6. Dashboard</h3>
              </div>

              <h4>6.1 Top Section</h4>
              <ul>
                <li>Displays the user&apos;s active accounts.</li>
                <li>Includes account balance and balance distribution.</li>
                <li>Clicking on the card redirects the user to the selected account.</li>
              </ul>

              <h4>6.2 Middle Statistics (Expenses and Income)</h4>
              <ul>
                <li>Provides an overview of expenses and income.</li>
                <li>Graphical representation of expenses and income over the last 10 days.</li>
              </ul>

              <h4>6.3 Bottom Statistics</h4>
              <ul>
                <li>Percentage boxes with expenses distribution.</li>
                <li>Graphical representation of expenses with amounts.</li>
                <li>Graphical representation of income sources.</li>
              </ul>

              <h4>6.4 Right Panel Transactions</h4>
              <ul>
                <li>Displays the most recent transactions.</li>
                <li>Users can click to view all transactions.</li>
              </ul>

              <div style={{ marginTop: '15px' }}>
                <h3>7. Transactions</h3>
              </div>

              <h4>7.1 Transactions list</h4>
              <ul>
                <li>Users should be able to view all their transactions.</li>
                <li>Filtering and pagination should be available.</li>
                <li>Users should be able to filter transactions by type and category.</li>
              </ul>
            </div>
          </div>
            
        </div>

        <footer>
          <div className='copyright'>
            <Image src={logoImage} alt="Register"></Image>
            <p>&copy; {curYear} MONETIS. All rights reserved.</p>
          </div>
        </footer>

        <button className={'back-to-top' + (visible ? ' show' : '')} onClick={scrollToTop}><BiUpArrowAlt/></button>
      </div>
    </>
  );
}

