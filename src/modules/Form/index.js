import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useNavigate } from 'react-router-dom';

const Form = ({ isSignInPage = true }) => {
  const [data, setData] = useState({
    ...(!isSignInPage && { fullName: '' }),
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInvalidModal, setShowInvalidModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `https://chatappbackend-production-8acf.up.railway.app/api/${isSignInPage ? 'login' : 'register'}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );

    if (res.status === 400) {
      if (!isSignInPage) {
        setShowErrorModal(true); // Sign-up: User already exists
      } else {
        setShowInvalidModal(true); // Sign-in: Wrong email or password
      }
    } else {
      const resData = await res.json();
      if (isSignInPage) {
        if (resData.token) {
          localStorage.setItem('user:token', resData.token);
          localStorage.setItem('user:detail', JSON.stringify(resData.user));
          navigate('/');
        }
      } else {
        setShowSuccessModal(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-lg py-12 px-10 shadow-2xl rounded-2xl flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          Welcome {isSignInPage && 'Back'}
        </h1>
        <p className="text-lg text-gray-500 mb-10">
          {isSignInPage ? 'Sign in to continue' : 'Sign up to get started'}
        </p>

        <form className="flex flex-col items-center w-full" onSubmit={handleSubmit} autoComplete="off">
          {!isSignInPage && (
            <Input
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              className="mb-6 w-[85%]"
              value={data.fullName}
              onChange={(e) => setData({ ...data, fullName: e.target.value })}
            />
          )}
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            className="mb-6 w-[85%]"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            className="mb-10 w-[85%]"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <Button label={isSignInPage ? 'Sign in' : 'Sign up'} type="submit" className="w-[85%] mb-2" />
        </form>

        <div className="mt-4 text-sm text-gray-600">
          {isSignInPage ? "Don't have an account?" : "Already have an account?"}{' '}
          <span
            className="text-blue-600 cursor-pointer underline"
            onClick={() => navigate(`/users/${isSignInPage ? 'sign_up' : 'sign_in'}`)}
          >
            {isSignInPage ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </div>

      {/* ✅ Success Modal */}
      {showSuccessModal && (
        <Modal
          title="🎉 Welcome!"
          message="You've been registered successfully."
          buttonText="Continue to Sign In"
          onClose={() => {
            setShowSuccessModal(false);
            navigate('/users/sign_in');
          }}
          type="success"
        />
      )}

      {/* ✅ Error Modal: User Already Exists */}
      {showErrorModal && (
        <Modal
          title="⚠️ User Already Exists"
          message="This email is already registered. Please sign in instead."
          buttonText="Close"
          onClose={() => setShowErrorModal(false)}
          type="error"
        />
      )}

      {/* ✅ Invalid Credentials Modal */}
      {showInvalidModal && (
        <Modal
          title="❌ Invalid Credentials"
          message="Please check your email or password and try again."
          buttonText="Retry"
          onClose={() => setShowInvalidModal(false)}
          type="warning"
        />
      )}
    </div>
  );
};

const Modal = ({ title, message, buttonText, onClose, type = 'info' }) => {
  const colorMap = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h2 className={`text-2xl font-bold mb-3 ${colorMap[type]}`}>{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Form;
