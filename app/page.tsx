"use client"
import { useEffect, useState } from "react";
import Wrapper from "./components/Wrapper";
import { FolderGit2 } from "lucide-react";
import { createProject, getProjectsCreatedByUser } from "./actions";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { Project } from "@/type";
import ProjectComponent from "./components/ProjectComponent";


export default function Home() {

  const {user} = useUser();
  const email = user?.primaryEmailAddress?.emailAddress as string;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async (email: string) => {
    try {
      const myProjects = await getProjectsCreatedByUser(email);
      setProjects(myProjects);
      console.log(myProjects);

    }catch (error) {
      console.error("Error when fetching projects:", error);
    }
  };

  useEffect(() => {
    if (email) {
      fetchProjects(email);
    }
  }, [email])

  const handleSubmit = async () => {
    try {
      const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
      await createProject(name, description, email);
      if(modal) {
        modal.close();
      }

      setName("");
      setDescription("");
      toast.success("Project created successfully 👍");

    }catch (error) {
      toast.error("Error when creating project");
      console.error("Error when creating project:", error);
    }
  };

  return (
    <Wrapper>
      <div>
        {/* You can open the modal using document.getElementById('ID').showModal() method */}
        <button title="create project" className="btn btn-primary mb-6" onClick={()=>(document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
          New Project <FolderGit2/>
        </button>
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>

            <h3 className="font-bold text-lg">New Project</h3>
            <p className="py-4">Describe your project</p>
            <div>
              <input
                type="text"
                placeholder="Name of project"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-base-300 input input-bordered w-full mb-4 placeholder:text-sm"
                required
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-2 textarea textarea-bordered border border-base-300 w-full textarea-md placeholder:text-sm"
                required
              >
              </textarea>
              <button className="btn btn-primary" disabled={name.trim().length < 3} onClick={handleSubmit}>
                New Project <FolderGit2/>
              </button>
            </div>
          </div>
        </dialog>

        <div className="w-full">
          
          {projects.length > 0 ? (
            <ul className="w-full grid md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <li key={project.id}>
                  <ProjectComponent project={project} admin={1}></ProjectComponent>
                </li>
              ))}
            </ul>
          ) : (
            <div></div>
          )}
        </div>

      </div>
    </Wrapper>
  );
}
