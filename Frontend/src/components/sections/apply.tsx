"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react"
import { suggestInternshipDomains } from '@/ai/flows/suggest-internship-domains'
import * as pdfjs from 'pdfjs-dist'

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
}

type Result = {
  company: string
  role: string
  cvMatchReason: string
  skillsRequired: string
  location: string
  directCareerLink: string
}

export function Apply() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Result[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0]
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }
      
      // Validate file type
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.docx')) {
        setError("Please upload a PDF or DOCX file")
        return
      }
      
      setFile(selectedFile)
      setResults([])
      setError(null)
    }
  }

  // CV text extraction
  const extractText = async (file: File): Promise<string> => {
    try {
      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjs.getDocument(arrayBuffer).promise
        let text = ""

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          text += content.items.map((item: any) => item.str).join(" ") + "\n"
        }
        
        return text.trim()
      }

      if (file.name.endsWith(".docx")) {
        const mammoth = await import("mammoth")
        const result = await mammoth.extractRawText({
          arrayBuffer: await file.arrayBuffer(),
        })
        return result.value.trim()
      }

      throw new Error("Unsupported file type")
    } catch (err) {
      console.error("Text extraction error:", err)
      throw new Error("Failed to extract text from file. Please try another file.")
    }
  }

  const handleAnalyze = async () => {
    if (!file) return
    
    setLoading(true)
    setError(null)

    try {
      // Extract text from CV
      const resumeText = await extractText(file)
      
      if (!resumeText || resumeText.length < 100) {
        throw new Error("CV appears to be empty or too short. Please upload a valid CV.")
      }

      // Call Genkit server action
      const response = await suggestInternshipDomains({
        resume: resumeText,
      })

      if (!response.results || response.results.length === 0) {
        setError("No matching internships found. Try updating your CV with more details.")
      } else {
        setResults(response.results)
      }
    } catch (err) {
      console.error("Analysis error:", err)
      setError(err instanceof Error ? err.message : "An error occurred while analyzing your CV")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="apply" className="py-16 md:py-24">
      <div className="container max-w-6xl">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold sm:text-4xl font-headline">
            Upload Your CV Here
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            AI-verified internship matches based strictly on your CV.
          </p>
        </div>

        <div className="mt-12 max-w-xl mx-auto">
          <Card>
            <CardContent className="p-8 space-y-6">
              <label className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-muted transition-colors">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {file ? file.name : "Upload CV (PDF / DOCX)"}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  Max file size: 5MB
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                size="lg"
                className="w-full"
                disabled={!file || loading}
                onClick={handleAnalyze}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Matching internships...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Find Matching Internships
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        {results.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6">
              Found {results.length} Matching Internship{results.length !== 1 ? 's' : ''}
            </h3>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left font-semibold">Company</th>
                    <th className="p-3 text-left font-semibold">Role</th>
                    <th className="p-3 text-left font-semibold">CV Match Reason</th>
                    <th className="p-3 text-left font-semibold">Skills Required</th>
                    <th className="p-3 text-left font-semibold">Location</th>
                    <th className="p-3 text-left font-semibold">Apply</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="border-t hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-medium">{r.company}</td>
                      <td className="p-3">{r.role}</td>
                      <td className="p-3 text-muted-foreground">{r.cvMatchReason}</td>
                      <td className="p-3">{r.skillsRequired}</td>
                      <td className="p-3">{r.location}</td>
                      <td className="p-3">
                        <a
                          href={r.directCareerLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                        >
                          Apply →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}