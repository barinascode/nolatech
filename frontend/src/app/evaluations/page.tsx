
"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Download } from 'lucide-react'; // Removed unused List, LayoutGrid
import { useAppSelector } from '@/hooks/useAppSelector';
import type { AppDispatch } from '@/redux/store';
import { fetchEvaluations } from '@/redux/slices/evaluationsSlice';
import { EvaluationItem } from '@/components/evaluations/EvaluationItem';
import { EvaluationCard } from '@/components/evaluations/EvaluationCard';
import { ViewToggle } from '@/components/evaluations/ViewToggle';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import { AlertTriangle } from 'lucide-react'; // Import icon for error alert
import { useRouter } from 'next/navigation'; // Import useRouter

type ViewMode = 'list' | 'card';

export default function EvaluationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter(); // Initialize router
  // Select state from Redux store
  const { evaluations, loading, error } = useAppSelector((state) => state.evaluations);
  const [viewMode, setViewMode] = useState<ViewMode>('list'); // Default to list view

  useEffect(() => {
    // Dispatch the fetchEvaluations thunk when the component mounts
    console.log('EvaluationsPage mounted, dispatching fetchEvaluations...');
    dispatch(fetchEvaluations());
  }, [dispatch]); // Dependency array ensures this runs only once on mount

  const handleCreateEvaluation = () => {
    // Navigate to the create evaluation page
    router.push('/evaluations/create');
    // console.log('Navigate to create evaluation page'); // Keep for debugging if needed
  };

  const handleExport = () => {
    // Placeholder for export functionality
    alert('Export functionality not yet implemented.');
  };

  const handleImport = () => {
    // Placeholder for import functionality
    alert('Import functionality not yet implemented.');
  };

  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">My Evaluations</h1>
        <div className="flex items-center flex-wrap gap-2">
          {/* Toggle between list and card view */}
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
          {/* Action buttons */}
           <Button size="sm" variant="outline" onClick={handleImport}>
            {/* Ensure icon color contrasts with button background */}
            <Upload className="mr-2 h-4 w-4 text-foreground" /> Import
          </Button>
          <Button size="sm" variant="outline" onClick={handleExport}>
            {/* Ensure icon color contrasts with button background */}
            <Download className="mr-2 h-4 w-4 text-foreground" /> Export
          </Button>
          <Button size="sm" onClick={handleCreateEvaluation}>
            <Plus className="mr-2 h-4 w-4" /> Create New
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={`grid gap-4 ${viewMode === 'list' ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
          {/* Render skeletons based on view mode */}
          {Array.from({ length: viewMode === 'list' ? 4 : 8 }).map((_, index) => (
            viewMode === 'list' ? (
               <div key={index} className="flex items-center gap-2 mb-4">
                 <Skeleton className="h-28 w-full rounded-lg" />
                 <Skeleton className="h-10 w-10 rounded-md" /> {/* Skeleton for edit button */}
               </div>
            ) : (
               <Skeleton key={index} className="h-48 w-full rounded-lg" />
            )
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
         <Alert variant="destructive" className="mt-4">
           <AlertTriangle className="h-4 w-4" />
           <AlertTitle>Error Fetching Evaluations</AlertTitle>
           <AlertDescription>
             {/* Display the error message from Redux state */}
             {error || 'An unexpected error occurred. Please try again.'}
           </AlertDescription>
            {/* Optional: Add a retry button */}
            <Button variant="secondary" size="sm" onClick={() => dispatch(fetchEvaluations())} className="mt-2">Retry</Button>
         </Alert>
      )}

      {/* Empty State */}
      {!loading && !error && evaluations.length === 0 && (
        <div className="text-center text-muted-foreground mt-10 border border-dashed border-border rounded-lg p-8">
          <h3 className="text-lg font-semibold mb-2">No Evaluations Found</h3>
          <p className="mb-4">You haven't created any evaluations yet.</p>
          <Button size="sm" onClick={handleCreateEvaluation}>
            <Plus className="mr-2 h-4 w-4" /> Create Your First Evaluation
          </Button>
        </div>
      )}

      {/* Success State - Display Evaluations */}
      {!loading && !error && evaluations.length > 0 && (
         // Removed grid from here for list view, handled inside EvaluationItem now
        <div className={`${viewMode === 'card' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : ''}`}>
          {evaluations.map((evaluation) =>
            viewMode === 'list' ? (
              // EvaluationItem now contains the flex container and button
              <EvaluationItem key={evaluation._id} evaluation={evaluation} />
            ) : (
              <EvaluationCard key={evaluation._id} evaluation={evaluation} />
            )
          )}
        </div>
      )}
    </Layout>
  );
}
