"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  Mic,
  Brain,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Github,
  ExternalLink,
  CheckCircle,
  Code,
  Database,
  Cloud,
} from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Real-Time Voice Interaction",
      description:
        "Practice with AI that responds naturally to your voice, simulating authentic interview conversations.",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Intelligent Feedback",
      description: "Get instant, personalized feedback on your responses, communication style, and technical accuracy.",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Performance Tracking",
      description: "Monitor your progress over time with detailed analytics and improvement recommendations.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Multiple Interview Types",
      description: "Practice technical coding interviews, behavioral questions, and industry-specific scenarios.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Realistic Pressure Simulation",
      description: "Experience authentic interview pressure to build confidence for real-world situations.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your practice sessions and data are protected with enterprise-grade security.",
    },
  ]

  const techStack = [
    {
      category: "Frontend",
      icon: <Code className="h-5 w-5" />,
      technologies: ["Next.js 14", "React", "TypeScript", "Tailwind CSS"],
    },
    {
      category: "Backend & Database",
      icon: <Database className="h-5 w-5" />,
      technologies: ["Firebase Auth", "Firestore", "Server Actions"],
    },
    {
      category: "AI & Voice",
      icon: <Brain className="h-5 w-5" />,
      technologies: ["Vapi AI", "Real-time Speech Processing", "Natural Language Processing"],
    },
    {
      category: "Deployment",
      icon: <Cloud className="h-5 w-5" />,
      technologies: ["Vercel", "CI/CD Pipeline", "Edge Functions"],
    },
  ]

  const steps = [
    {
      number: "01",
      title: "Choose Your Interview Type",
      description:
        "Select from technical, behavioral, or industry-specific interview formats tailored to your career goals.",
    },
    {
      number: "02",
      title: "Start Voice Conversation",
      description: "Engage with our AI interviewer through natural voice interaction, just like a real interview.",
    },
    {
      number: "03",
      title: "Receive Instant Feedback",
      description: "Get immediate, actionable insights on your performance, communication, and areas for improvement.",
    },
    {
      number: "04",
      title: "Track Your Progress",
      description: "Monitor your improvement over time with detailed analytics and personalized recommendations.",
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  return (
    <div
      className="min-h-screen bg-black text-white relative overflow-hidden"
      style={{
        backgroundImage: "url('/pattern.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "400px 400px",
      }}
    >
      {/* Dark overlay to ensure readability */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />
          <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Badge
                  variant="secondary"
                  className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors duration-300"
                >
                  AI-Powered Interview Platform
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
              >
                Meet{" "}
                <span className="text-white font-extrabold underline decoration-4 underline-offset-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Mockrithm
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-6 text-lg leading-8 text-gray-300 sm:text-xl"
              >
                The future of interview preparation. Practice with AI-powered voice interactions, get instant feedback,
                and build the confidence you need to land your dream job.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-10 flex items-center justify-center gap-x-6"
              >
                <Link href="/interview">
                  <Button
                    size="lg"
                    className="bg-white text-black border-0 transform hover:scale-105 transition-all duration-300"
                  >
                    Start Practicing
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="https://github.com/AHAPRX/interviewer" target="_blank">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10 transform hover:scale-105 transition-all duration-300 bg-transparent"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    View Source
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="py-24 sm:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
                Our Mission
              </motion.h2>
              <motion.p variants={itemVariants} className="mt-6 text-lg leading-8 text-gray-300">
                We believe that everyone deserves the opportunity to showcase their best self in interviews. Mockrithm
                democratizes interview preparation by providing AI-powered, personalized practice sessions that adapt to
                your unique needs and help you build genuine confidence.
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* How It Works */}
        <section className="py-24 sm:py-32 bg-white/5 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">How Mockrithm Works</h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Four simple steps to transform your interview skills
              </p>
            </motion.div>

            <div className="mx-auto mt-16 max-w-5xl">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
              >
                {steps.map((step, index) => (
                  <motion.div key={index} variants={itemVariants} whileHover={{ scale: 1.05 }} className="relative">
                    <div className="flex flex-col items-center text-center">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-black-500/20 to-white-500/20 border border-white/20 backdrop-blur-sm"
                      >
                        <span className="text-xl font-bold text-white">{step.number}</span>
                      </motion.div>
                      <h3 className="mt-6 text-lg font-semibold text-white">{step.title}</h3>
                      <p className="mt-2 text-sm text-gray-400">{step.description}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="absolute top-8 left-full hidden w-full lg:block">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          transition={{ duration: 0.8, delay: index * 0.2 }}
                          className="h-px bg-gradient-to-r from-white/50 to-transparent origin-left"
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">Why Choose Mockrithm?</h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Advanced AI technology meets practical interview preparation
              </p>
            </motion.div>

            <div className="mx-auto mt-16 max-w-6xl">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <Card className="bg-white/5 border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-white-500/20 to-gray-500/20 text-white border border-white/10"
                          >
                            {feature.icon}
                          </motion.div>
                          <div>
                            <h3 className="font-semibold text-white">{feature.title}</h3>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-gray-400">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-24 sm:py-32 bg-white/5 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">Built with Modern Technology</h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Powered by cutting-edge tools and frameworks for optimal performance
              </p>
            </motion.div>

            <div className="mx-auto mt-16 max-w-5xl">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
              >
                {techStack.map((stack, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <Card className="bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-300 backdrop-blur-sm h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <motion.div whileHover={{ scale: 1.2 }} className="text-white">
                            {stack.icon}
                          </motion.div>
                          <h3 className="font-semibold text-white">{stack.category}</h3>
                        </div>
                        <ul className="space-y-2">
                          {stack.technologies.map((tech, techIndex) => (
                            <motion.li
                              key={techIndex}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: techIndex * 0.1,
                              }}
                              className="flex items-center gap-2 text-sm text-gray-400"
                            >
                              <CheckCircle className="h-3 w-3 text-green-400" />
                              {tech}
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Built By Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="py-24 sm:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                <Card className="bg-gradient-to-r from-white/10 to-white/5 border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm">
                  <CardContent className="p-8 sm:p-12">
                    <div className="text-center">
                      <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight text-white">
                        Built by Ahmed, for Everyone
                      </motion.h2>
                      <motion.p variants={itemVariants} className="mt-6 text-lg text-gray-300">
                        Mockrithm was created by Ahmed — someone who understands the challenges of technical interviews
                        firsthand. I've experienced the stress, the preparation struggles, and the need for better
                        practice tools. That's why I built something different.
                      </motion.p>
                      <motion.p variants={itemVariants} className="mt-4 text-gray-400">
                        This isn't just another interview prep tool—it's a comprehensive platform designed with
                        real-world experience and technical expertise at its core.
                      </motion.p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
