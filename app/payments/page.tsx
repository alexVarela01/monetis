'use client';

import { useAuth } from '@/app/hooks/useAuth';
import Navigation from '@/app/Components/Navigation/Navigation';
import './styles.css';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { ClipLoader, GridLoader } from 'react-spinners';
import StaticLoader from '../Components/StaticLoader/StaticLoader';
import Select from 'react-select'
import { formatBalance, formatDate, formatIban } from '../utils/helpers';
import { FaCheck } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';

interface AccountInterface {
  id: number;
  name: string;
  amount: number;
  iban: string;
  created_at: string;
  updated_at: string;
  accountHolder: string;
}

// Definição dos tipos
type PaymentData = {
  sourceAccount: number;
  amount: number;
  entity: string;
  reference: string;
  category: string;
};

const categories = [
  "Online Shopping",
  "Groceries",
  "Entertainment",
  "Clothing",
  "Bills",
  "Car",
  "Mobile",
  "House",
  "Travel",
  "Other",
];

export default function Payment() {
  useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [userAccounts, setUserAccounts] = useState<Array<AccountInterface>>([]);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [formPhase, setFormPhase] = useState<number>(1);
  const [accountHolder, setAccountHolder] = useState<string>('');
  const [formData, setFormData] = useState<Omit<PaymentData, 'id'>>({
    sourceAccount: 0,
    amount: 0,
    reference: '',
    entity: '',
    category: ''
  });

  async function fetchAccounts() {
    try {
      const response = await fetch('/api/users/data', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const accountData = await response.json();
      setFormData({ ...formData, sourceAccount: accountData.accounts[0].id });
      setAccountHolder(accountData.accountHolder);
      setUserAccounts(accountData.accounts.map((account: AccountInterface) => ({ name: account.name, amount: account.amount, iban: account.iban, accountHolder: accountData.accountHolder, id: account.id, created_at: account.created_at, updated_at: account.updated_at })));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    document.title = 'MONETIS | Payment';
    setLoading(true);
    setIsClient(true);
    setFormPhase(1);
    fetchAccounts();
  }, []);

  const moveToConfirmationPhase = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ((userAccounts?.find((account: AccountInterface) => account.id === formData.sourceAccount)?.amount ?? 0) < formData.amount) {
      toast.error("Insufficient balance in source account", {
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    setFormPhase(2);
  };

  const moveToSuccessPhase = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingAction(true);
    launchRequest(e, '/api/account/payment', {amount: formData.amount, account_id: formData.sourceAccount, entity: formData.entity, reference: formData.reference, category: formData.category});
  };

  const closePhase = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchAccounts();
    setFormPhase(1);
  };
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // dont allow + and -
    if (value.startsWith('-') || value.startsWith('+')) return;

    // check if is valid number
    if (isNaN(Number(value))) return;

    // only allow max 2 decimals
    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts[1].length > 2) {
        return;
      }
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAccountChange = (accountId: number) => {
    setFormData((prevData) => ({ ...prevData, sourceAccount: accountId }));
    setFormData((prevData) => ({ ...prevData, targetAccount: 0 }));
  };

  const launchRequest = async (e: FormEvent<HTMLFormElement>, url: string, data: object) => {
    try {
      const requestResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const requestData = await requestResponse.json();
      if (requestResponse.status !== 200) {
        toast.dismiss();
        for (const error of requestData.errors) {
          toast.error(error, {
            position: "bottom-right",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
          });
        }

        return;
      }

      setFormPhase(3);
    } catch (error: unknown) {
      console.error('An unexpected error happened:', error);
    } finally {
      setLoadingAction(false);
    }
  }

  return (
    <div className='payment'>
      <Navigation />

      <div className='content'>
        <h1>Payments</h1>

        <div className="panels">
          <div className="left">
            {isClient && userAccounts[0] && 
              <>

                {formPhase === 1 &&
                  <>
                    <h2>Select account</h2>
                    <Select 
                      options={userAccounts.map((account: AccountInterface) => ({value: account.id, label: account.name }))} 
                      defaultValue={{value: userAccounts[0].id, label: userAccounts[0]?.name}}  
                      onChange={(newValue) => {
                        if (newValue) {
                          handleAccountChange(newValue.value);
                        }
                      }}
                      className='select'/>
                  </>
                }

                <div className='accountInformation'>
                  <div className='item name'>{userAccounts.filter((account: AccountInterface) => account.id === formData?.sourceAccount)[0]?.name}</div>
                  <hr />
                  <div className='item balance'><span>Balance </span>{formatBalance(userAccounts.filter((account: AccountInterface) => account.id === formData?.sourceAccount)[0]?.amount)} €</div>
                  <div className='item'><span>IBAN </span>{formatIban(userAccounts.filter((account: AccountInterface) => account.id === formData?.sourceAccount)[0]?.iban)}</div>
                  <div className='item'><span>Account holder </span>{accountHolder}</div>
                </div>
                <div className='accountInformation'>
                  <div className='item'><span>Created at </span>{formatDate(userAccounts.filter((account: AccountInterface) => account.id === formData?.sourceAccount)[0]?.created_at)}</div>
                  <div className='item'><span>Last transaction </span>{formatDate(userAccounts.filter((account: AccountInterface) => account.id === formData?.sourceAccount)[0]?.updated_at)}</div>
                </div>

                <button onClick={() => window.location.href = `/accounts/${userAccounts.filter((account: AccountInterface) => account.id === formData?.sourceAccount)[0]?.id}`} className='button'>See account details</button>
              </>
            }

          </div>
          <div className="right">

            <div className='status'>
              <div className={'item ' + (formPhase >= 1 ? 'active' : '')}>
                <span>Details</span>
                <div className='circle'>
                  {formPhase >= 2 &&
                    <FaCheck/>
                  }
                </div>
              </div>

              <hr className={(formPhase >= 2 ? 'active' : '')} />

              <div className={'item ' + (formPhase  >= 2 ? 'active' : '')}>
                <span>Confirmation</span>
                <div className='circle'>
                  {formPhase >= 3 &&
                    <FaCheck/>
                  }
                </div>
              </div>

              <hr className={(formPhase >= 3 ? 'active' : '')} />

              <div className={'item ' + (formPhase  >= 3 ? 'active' : '')}>
                <span>Success</span>
                <div className='circle'>
                  {formPhase >= 3 &&
                    <FaCheck/>
                  }
                </div>
              </div>
            </div>

            {formPhase === 1 &&
              <form onSubmit={moveToConfirmationPhase}>
                <h2>Fill in payment details</h2>

                <div className='row'>
                  <div className='column required'>
                  <label htmlFor="effectivedate">Transaction date</label>
                    <input
                      type="text"
                      name="effectivedate"
                      maxLength={20}
                      placeholder="John"
                      value={formatDate(new Date().toDateString())}
                      readOnly
                    />
                  </div>
                </div>

                <div className='row'>
                  <div className='column required'>
                    <label htmlFor="entity">Entity</label>
                    <input
                      type="text"
                      name="entity"
                      placeholder="00000"
                      maxLength={5}
                      value={formData.entity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='column required'>
                    <label htmlFor="reference">Reference</label>
                    <input
                      type="text"
                      maxLength={20}
                      placeholder="INV-20240201"
                      name="reference"
                      value={formData.reference}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className='row'>
                  <div className='column required'>
                    <label htmlFor="targetownaccount">Category</label>
                    {isClient &&
                      <Select 
                        options={categories.map((value: string) => ({value: value, label: value }))} 
                        onChange={(newValue) => {
                          if (newValue) {
                            setFormData({ ...formData, category: newValue.value });
                          }
                        }}
                        className='select'
                        name='targetAccount'
                        value={formData.category && {value: formData?.category, label: formData?.category}}
                        required/>
                    }
                  </div>

                  <div className='column required'>
                    <label htmlFor="name">Amount</label>
                    <div className='suffix_container'>
                      <input
                        type="text"
                        name="amount"
                        placeholder="10"
                        style={{ textAlign: 'right' }}
                        value={formData.amount}
                        onChange={handleAmountChange}
                        required
                      />
                      <span>€</span>
                    </div>
                  </div>
                </div>
                <button>Next</button>
              </form>
            }

            {formPhase === 2 &&
              <form onSubmit={moveToSuccessPhase}>
                <h2>Confirm transaction details</h2>

                <p className='text info'>Please confirm the following transaction details before submitting:</p>

                <p className='text info'><strong>Transaction date:</strong> {formatDate(new Date().toDateString())}</p>

                <p className='text'><strong>From account:</strong> {userAccounts.filter((account: AccountInterface) => account.id === formData?.sourceAccount)[0]?.name}</p>
                
                <p className='text info'><strong>Entity:</strong> {formData.entity}</p>
                <p className='text'><strong>Reference:</strong> {formData.reference}</p>
                <p className='text'><strong>Category:</strong> {formData.category}</p>

                <p className='text info'><strong>Payment amount</strong> <br /><span className='balance-negative'>-{formatBalance(Number(formData?.amount))}€</span></p>
                <p className='text info'><strong>Account balance after payment</strong> <br /><span className='balance'>{formatBalance(Number(userAccounts.filter((account: AccountInterface) => account.id === formData?.sourceAccount)[0]?.amount) - Number(formData?.amount))}€</span></p>

                <div className="row">
                  <button type='button' onClick={() => setFormPhase(1)}>Go back</button>

                  <button type="submit" disabled={loadingAction}>
                    {loadingAction ? <ClipLoader color="#fff" size={11} /> : 'Next'}
                  </button>
                </div>
              </form>
            }

            {formPhase === 3 &&
              <form onSubmit={closePhase}>
                <h2>Transaction completed!</h2>

                <p className='text info'>The transaction has been completed successfully</p>

                <p className='text info'><strong>Transaction date:</strong> {formatDate(new Date().toDateString())}</p>

                <p className='text'><strong>From account:</strong> {userAccounts.filter((account: AccountInterface) => account.id === formData?.sourceAccount)[0]?.name}</p>

                <p className='text info'><strong>Entity:</strong> {formData.entity}</p>
                <p className='text'><strong>Reference:</strong> {formData.reference}</p>
                <p className='text'><strong>Category:</strong> {formData.category}</p>

                <p className='text info'><strong>Payment amount</strong> <br /><span className='balance-negative'>-{formatBalance(Number(formData?.amount))}€</span></p>
                <p className='text info'><strong>Account balance after payment</strong> <br /><span className='balance'>{formatBalance(Number(userAccounts.filter((account: AccountInterface) => account.id === formData?.sourceAccount)[0]?.amount) - Number(formData?.amount))}€</span></p>


                <div className="row">
                  <button type='submit'>Close</button>
                </div>
              </form>
            }
          </div>
        </div>
      </div>
      <div className={`loading_screen ${!loading ? "hidden" : ""}`}>
        {isClient ? (
          <GridLoader color="#4d8bf7" size={10} />
        ) : (
          <StaticLoader/>
        )}
      </div>

      <ToastContainer/>
    </div>
  );
}
