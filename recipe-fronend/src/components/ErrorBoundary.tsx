import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center bg-white p-12 rounded-2xl shadow-2xl max-w-md mx-4">
            <div className="text-6xl mb-6">😵</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We encountered an unexpected error. Don't worry, it's not your fault!
            </p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🔄 Refresh Page
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200"
              >
                🏠 Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
