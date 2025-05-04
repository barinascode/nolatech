
"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Layout } from '@/components/Layout';
import { useAppSelector } from '@/hooks/useAppSelector';
import type { AppDispatch } from '@/redux/store';
import { fetchAssignedEvaluations } from '@/redux/slices/evaluationsSlice'; // Import the new thunk
import { EvaluationItem } from '@/components/evaluations/EvaluationItem';
import { EvaluationCard } from '@/components/evaluations/EvaluationCard';
import { ViewToggle } from '@/components/evaluations/ViewToggle';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Import Button for retry

type ViewMode = 'list' | 'card';

export default function AssignedEvaluationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  // Select state from Redux store for assigned evaluations
  const { assignedEvaluations, loadingAssigned, errorAssigned } = useAppSelector(
    (state) => state.evaluations
  );
  const [viewMode, setViewMode] = useState<ViewMode>('list'); // Default to list view

  useEffect(() => {
    // Dispatch the fetchAssignedEvaluations thunk when the component mounts
    console.log('AssignedEvaluationsPage mounted, dispatching fetchAssignedEvaluations...');
    dispatch(fetchAssignedEvaluations());
  }, [dispatch]); // Dependency array ensures this runs only once on mount

  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Assigned Evaluations</h1>
        <div className="flex items-center flex-wrap gap-2">
          {/* Toggle between list and card view */}
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
          {/* No Create/Import/Export buttons here */}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        These are the evaluations you need to provide feedback for.
      </p>

      {/* Loading State */}
      {loadingAssigned && (
        <div className={`grid gap-4 ${viewMode === 'list' ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
          {Array.from({ length: viewMode === 'list' ? 4 : 8 }).map((_, index) => (
            viewMode === 'list' ? (
              // Skeleton for list item (without edit button)
              <div key={index} className="flex items-center gap-2 mb-4">
                 <Skeleton className="h-28 w-full rounded-lg" />
                 {/* No skeleton for edit button */}
               </div>
            ) : (
               <Skeleton key={index} className="h-48 w-full rounded-lg" />
            )
          ))}
        </div>
      )}

      {/* Error State */}
      {errorAssigned && !loadingAssigned && (
         <Alert variant="destructive" className="mt-4">
           <AlertTriangle className="h-4 w-4" />
           <AlertTitle>Error Fetching Assigned Evaluations</AlertTitle>
           <AlertDescription>
             {errorAssigned || 'An unexpected error occurred. Please try again.'}
           </AlertDescription>
           <Button variant="secondary" size="sm" onClick={() => dispatch(fetchAssignedEvaluations())} className="mt-2">Retry</Button>
         </Alert>
      )}

      {/* Empty State */}
      {!loadingAssigned && !errorAssigned && assignedEvaluations.length === 0 && (
        <div className="text-center text-muted-foreground mt-10 border border-dashed border-border rounded-lg p-8">
           <ClipboardCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Assigned Evaluations</h3>
          <p>You currently have no evaluations assigned to you for feedback.</p>
        </div>
      )}

      {/* Success State - Display Assigned Evaluations */}
      {!loadingAssigned && !errorAssigned && assignedEvaluations.length > 0 && (
        <div className={`${viewMode === 'card' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : ''}`}>
          {assignedEvaluations.map((evaluation) =>
            viewMode === 'list' ? (
              // Pass showEditButton={false} and targetRoutePrefix
              <EvaluationItem
                key={evaluation._id}
                evaluation={evaluation}
                showEditButton={false}
                targetRoutePrefix="/feedback/start"
              />
            ) : (
              // Pass targetRoutePrefix to EvaluationCard
              <EvaluationCard
                key={evaluation._id}
                evaluation={evaluation}
                targetRoutePrefix="/feedback/start"
              />
            )
          )}
        </div>
      )}
    </Layout>
  );
}
