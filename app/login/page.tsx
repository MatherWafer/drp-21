'use client';

import { useState } from 'react';
import { login, signup } from './actions';
import { sign } from 'crypto';

export default function AuthForm({

}) {
  const [isLogin, setIsLogin] = useState(true);
  const [emailSent, setEmailSent] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      // Call your signup function or API route here
      setEmailSent(true);
      await signup(formData);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await login(formData);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="bg-zinc-800 p-8 rounded-2xl shadow-lg max-w-md mx-auto mt-12 border border-zinc-700">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isLogin ? 'Welcome Back!' : 'Join Us!'}
      </h2>

      {emailSent && (
        <div className="bg-green-700 text-green-200 px-4 py-2 rounded mb-4 text-center">
          A confirmation email has been sent! Please check your inbox.
        </div>
      )}

      <form
        className="space-y-4"
        onSubmit={isLogin ? handleLogin : handleSignup}
      >
        <div>
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-medium text-zinc-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>

        {!isLogin && (
          <div>
            <label
              htmlFor="name"
              className="block mb-1 text-sm font-medium text-zinc-300"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="password"
            className="block mb-1 text-sm font-medium text-zinc-300"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>

        <div className="mt-6">
          <button
            type={isLogin ? 'submit' : 'submit'}
            onClick={() => isLogin && null}
            className="w-full bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-xl transition-all duration-300 border border-zinc-600"
            {...(isLogin
              ? { formAction: login }
              : { formAction: signup })}
          >
            {isLogin ? 'Log in' : 'Sign up'}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setEmailSent(false);
          }}
          className="text-sm text-zinc-400 hover:underline"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : 'Already have an account? Log in'}
        </button>
      </div>
    </div>
  );
}
