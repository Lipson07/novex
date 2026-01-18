import { useState } from 'react';
import { ProjectsData } from '../MockData/Projects.Mockdata';
import styles from './Detail.Projects.module.scss';
import { ArrowRightIcon } from '../UI/Icons';
import type { ProjectInterface } from '../interfaces/Interfaces';

export default function DetailProject({ name }) {
  const [projects, setProjects] = useState<ProjectInterface[]>(ProjectsData);
  return (
    <div className={styles.allDetailProject}>
      {projects.filter((proj) => proj.title === name).map((proj) => (
        <div key={proj.id} className={styles.DetailProjectHeader}>
          <ArrowRightIcon />
          <span>Projects</span>/<span>{proj.title}</span>
        </div>
      ))}
    </div>
  );
}
