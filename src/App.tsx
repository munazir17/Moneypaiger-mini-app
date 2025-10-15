import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useEffect } from 'react';

// Declare Farcaster SDK type
declare global {
  interface Window {
    FarcasterFrameSDK?: {
      init: () => Promise<any>;
      actions?: {
        ready: () => void;
      };
    };
  }
}

function App() {
  // Initialize Farcaster SDK
  useEffect(() => {
    const initFarcaster = async () => {
      if (window.FarcasterFrameSDK) {
        try {
          const context = await window.FarcasterFrameSDK.init();
          console.log('✅ Farcaster SDK initialized:', context);
          
          // Notify Farcaster that app is ready
          if (window.FarcasterFrameSDK.actions) {
            window.FarcasterFrameSDK.actions.ready();
            console.log('✅ App ready signal sent');
          }
        } catch (err) {
          console.log('ℹ️ Not in Farcaster context:', err);
        }
      }
    };

    // Initialize on mount
    initFarcaster();

    // Also try on window load as fallback
    window.addEventListener('load', () => {
      if (window.FarcasterFrameSDK?.actions) {
        window.FarcasterFrameSDK.actions.ready();
      }
    });
  }, []);

  // Your existing App component code continues below...
  return (
    <div className="App">
      {/* Your existing JSX */}
    </div>
  );
}

export default App;
interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  // Handle URL parameters from Farcaster Frame
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    
    if (action === 'income') {
      setFormType('income');
      setShowForm(true);
    } else if (action === 'expense') {
      setFormType('expense');
      setShowForm(true);
    }

    // Load transactions from localStorage
    const saved = localStorage.getItem('moneypaiger_transactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  // Save transactions to localStorage
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('moneypaiger_transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: formType,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date().toISOString(),
    };

    setTransactions([newTransaction, ...transactions]);
    
    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setShowForm(false);
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MoneyPaiger</h1>
                <p className="text-sm text-gray-600">Timeline of Digital Finance</p>
              </div>
            </div>
            <a 
              href="https://warpcast.com/munazir" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              by @munazir
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Balance</span>
              <Wallet className="w-5 h-5 text-indigo-600" />
            </div>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
              ${balance.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Income</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Expenses</span>
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              setFormType('income');
              setShowForm(true);
            }}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md"
          >
            💰 Add Income
          </button>
          <button
            onClick={() => {
              setFormType('expense');
              setShowForm(true);
            }}
            className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all shadow-md"
          >
            💸 Add Expense
          </button>
        </div>

        {/* Transaction Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Add {formType === 'income' ? '💰 Income' : '💸 Expense'}
            </h2>
            <form onSubmit={addTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={formType === 'income' ? 'Salary, Freelance, Investment' : 'Food, Transport, Bills'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Brief description"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Add {formType === 'income' ? 'Income' : 'Expense'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-lg mb-2">No transactions yet</p>
                <p className="text-sm">Add your first income or expense to get started!</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="w-6 h-6" />
                        ) : (
                          <TrendingDown className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{transaction.category}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className={`text-xl font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm pb-8">
          <p>Built by <a href="https://warpcast.com/munazir" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 font-medium">@munazir</a> on Farcaster</p>
          <p className="mt-2">Timeline of Digital Finance - Since 2017</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
