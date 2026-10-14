import portal from "./images/portal.jpg";
import flightNetwork from "./images/fn.jpg";
import studyAgenda from "./images/usability.jpg";
import imageHash from "./images/imagehash.png";

export const intro = {
  eyebrow: "Full Stack Software Engineer",
  heading: "Hi, I’m Anna.",
  lede: "I am passionate about User Experience and delivering quality software. Requirements, spec, code, tests, go-live, maintenance: every stage is exciting and challenging, yielding rewards!",
};

export const links = {
  email: "anna.fatsevych@gmail.com",
  github: "https://github.com/annafatsevych",
  linkedin: "https://www.linkedin.com/in/anna-fatsevych-2096a664/",
  cv: "/cv/",
  blog: "https://annafatsevych.wordpress.com/",
};

// `width`/`height` are the image's real size, so the page doesn't jump while it loads.
export const projects = [
  {
    name: "Customer Portal",
    image: portal,
    width: 1200,
    height: 668,
    alt: "Customer Portal dashboard",
    description:
      "A React application on an internal API with FusionAuth sign-in. External clients manage configurations and users, view key information and search records with detailed criteria.",
    stack: "React · Redux · FusionAuth · Google Cloud",
  },
  {
    name: "FlightNetwork.com",
    image: flightNetwork,
    width: 1200,
    height: 494,
    alt: "FlightNetwork.com homepage",
    description:
      "A responsive, high-traffic travel site with A/B testing and multi-language support. Worked with the UX team on a complete front-end redesign of a large, long-lived codebase.",
    stack: "React · Redux · Sass · Webpack · Node",
  },
  {
    name: "Study Agenda",
    image: studyAgenda,
    width: 1200,
    height: 675,
    alt: "Study Agenda usability poster",
    description:
      "A time-management app for students, built by a team of four over a year as a Seneca College capstone. Released on time and showcased as a top pick among peers and sponsors.",
    stack: "AngularJS · MongoDB · Node · Express",
  },
  {
    name: "pHash Image Search",
    image: imageHash,
    width: 1100,
    height: 1057,
    alt: "pHash image search results",
    imagePosition: "center",
    description:
      "Hashes an uploaded image and checks it against a Creative Commons database to find whether it is licensed, and under which license. Built at Seneca’s Centre for Development of Open Technology.",
    stack: "JavaScript · Python · PHP · C++",
  },
];

// Newest first. A short version of the CV's timeline.
export const experience = [
  {
    when: "Present",
    role: "Full Stack Software Engineer",
    company: "TripStack (previously FlightNetwork)",
    summary:
      "Led the migration of a production app serving ~430 requests per second from Google Cloud VMs to Kubernetes, halving release time and cutting instances 35×. Builds React front ends and .NET, C# and Go services, and mentors new engineers.",
  },
  {
    when: "2015–2016",
    role: "Software Developer",
    company: "Centre for Development of Open Technology, Seneca",
    summary:
      "Built an image search that uses hashing to check Creative Commons licensing, in a team of two developers.",
  },
  {
    when: "2009–2017",
    role: "Owner, Designer & Web Developer",
    company: "Delicious Scrap Shop",
    summary:
      "Built and ran an online graphic design business serving over 5,000 customers, and created e-commerce sites for clients.",
  },
];
