import { useEffect, useState } from 'react';
import { fallbackProjectList, fetchProjects } from '../lib/projects';

export function useProjects() {
  const [projects, setProjects] = useState(fallbackProjectList);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchProjects()
      .then((projectList) => {
        if (!isMounted) return;
        setProjects(projectList.length ? projectList : fallbackProjectList);
        setError(null);
      })
      .catch((fetchError) => {
        if (!isMounted) return;
        setProjects(fallbackProjectList);
        setError(fetchError);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { projects, isLoading, error };
}
