import { ResumeType } from "@/types";

interface MinimalTemplateProps {
  resume: ResumeType;
  accentColor: string;
}

const MinimalTemplate = ({ resume, accentColor }: MinimalTemplateProps) => {
  const formatDate = (date: Date | string) => {
    if (!date) return "";
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 font-light">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-thin mb-4 tracking-wide">
          {resume.personal_info?.full_name || "Your Name"}
        </h1>

        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          {resume.personal_info?.email && <span>{resume.personal_info.email}</span>}
          {resume.personal_info?.phone && <span>{resume.personal_info.phone}</span>}
          {resume.personal_info?.location && (
            <span>{resume.personal_info.location}</span>
          )}
          {resume.personal_info?.linkedin && (
            <span className="break-all">{resume.personal_info.linkedin}</span>
          )}
          {resume.personal_info?.website && (
            <span className="break-all">{resume.personal_info.website}</span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {resume.professional_summary && (
        <section className="mb-10">
          <p className=" text-gray-700">{resume.professional_summary}</p>
        </section>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: accentColor }}
          >
            Experience
          </h2>

          <div className="space-y-6">
            {resume.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-medium">{exp.position}</h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(exp.start_date)} -{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date || new Date())}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{exp.company}</p>
                {exp.description && (
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {resume.project && resume.project.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: accentColor }}
          >
            Projects
          </h2>

          <div className="space-y-4">
            {resume.project.map((proj, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 justify-between items-baseline"
              >
                <h3 className="text-lg font-medium ">{proj.name}</h3>
                <p className="text-gray-600">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: accentColor }}
          >
            Education
          </h2>

          <div className="space-y-4">
            {resume.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-medium">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  {/* {edu.gpa && (
                    <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                  )} */}
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(edu.graduation_date)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <section>
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: accentColor }}
          >
            Skills
          </h2>

          <div className="text-gray-700">{resume.skills.join(" • ")}</div>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
