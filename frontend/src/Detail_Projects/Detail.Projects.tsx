import { useState } from 'react';
import { ProjectsData } from '../MockData/Projects.Mockdata';
import styles from './Detail.Projects.module.scss';
import { ArrowRightIcon } from '../UI/Icons';
export default function DetailProject({ name }) {
  const [Projects, setProjects] = useState(ProjectsData);
  return (
    <div className={styles.allDetailProject}>
      {Projects.filter((proj) => proj.title === name).map((proj) => (
        <div key={proj.id} className={styles.DetailProjectHeader}>
          <ArrowRightIcon />
          <span>Projects</span>/<span>{proj.title}</span>
        </div>
      ))}
    </div>
  );
}
