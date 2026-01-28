import { Job } from "./JobCard";
import JobCard from "./JobCard";

interface Props {
    jobs: Job[]
    addFilter: (filter: string) => void
}

export default function JobList({ jobs, addFilter} : Props) {
    return (
        <div className="max-w-7xl mx-auto mt-16 space-y-6 px-4">
            {jobs.map((job) => (
                <JobCard 
                    key={job._id} 
                    job={job} 
                    addFilter={addFilter} 
                />
            ))}
        </div>
    )
}
