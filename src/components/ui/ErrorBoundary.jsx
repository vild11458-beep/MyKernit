import React from 'react'

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
        this.setState({ errorInfo })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-red-50 text-red-900">
                    <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-xl border border-red-200">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">error</span>
                            Something went wrong
                        </h2>
                        <p className="font-mono text-sm bg-red-100 p-4 rounded overflow-auto mb-4">
                            {this.state.error && this.state.error.toString()}
                        </p>
                        <details className="text-xs text-gray-500">
                            <summary>Stack Trace</summary>
                            <pre className="mt-2 overflow-auto">
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                        <button
                            className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            onClick={() => window.location.reload()}
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
