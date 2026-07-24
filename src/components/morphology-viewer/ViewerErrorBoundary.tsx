"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type ViewerErrorBoundaryProps = {
  children: ReactNode;
  label?: string;
};

type ViewerErrorBoundaryState = {
  hasError: boolean;
};

export class ViewerErrorBoundary extends Component<
  ViewerErrorBoundaryProps,
  ViewerErrorBoundaryState
> {
  state: ViewerErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ViewerErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("3D morphology viewer error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-[34rem] w-full items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-6 text-center text-sm text-zinc-400">
          {this.props.label ?? "3D viewer could not load. Refresh the page to try again."}
        </div>
      );
    }

    return this.props.children;
  }
}
