'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemCount = cart?.items?.length ?? 0;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-primary font-bold text-xl">데일리팜</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/market"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-primary"
              >
                마켓
              </Link>
              <Link
                href="/farmers"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-primary"
              >
                농부 찾기
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <button
              type="button"
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">메뉴 열기</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            <div className="hidden sm:flex items-center">
              {user ? (
                <>
                  <Link
                    href="/cart"
                    className="p-2 text-gray-700 hover:text-primary relative"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                  <div className="ml-4 relative flex items-center space-x-4">
                    <Link
                      href="/dashboard"
                      className="text-gray-700 hover:text-primary"
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={logout}
                      className="text-gray-700 hover:text-primary"
                    >
                      로그아웃
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/auth/login"
                    className="text-gray-700 hover:text-primary"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={`${
            isMobileMenuOpen ? 'block' : 'hidden'
          } sm:hidden bg-white border-t border-gray-200 py-2`}
        >
          <div className="space-y-1">
            <Link
              href="/market"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary"
            >
              마켓
            </Link>
            <Link
              href="/farmers"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary"
            >
              농부 찾기
            </Link>
            {user ? (
              <>
                <Link
                  href="/cart"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary"
                >
                  장바구니 {cartItemCount > 0 && `(${cartItemCount})`}
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary"
                >
                  마이페이지
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 