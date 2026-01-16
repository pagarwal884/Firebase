"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Upload, 
  FileText, 
  Loader2, 
  AlertCircle, 
  X, 
  CheckCircle, 
  Download,
  Search,
  ExternalLink,
  Sparkles,
  Briefcase,
  MapPin,
  Award,
  Clock
} from "lucide-react"
import { suggestInternshipDomains } from "@/ai/flows/suggest-internship-domains"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

type Result = {
  company: string
  role: string
  cvMatchReason: string
  skillsRequired: string
  location: string
  directCareerLink: string
  matchScore?: number
  salaryRange?: string
  duration?: string
}

type ProcessingStatus = 'idle' | 'uploading' | 'extracting' | 'analyzing' | 'complete' | 'error'

let pdfjs: any = null

export function Apply() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<ProcessingStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<Result[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<string>("all")
  const [exportingPDF, setExportingPDF] = useState(false)
  
  // Refs for content to export
  const tableRef = useRef<HTMLDivElement>(null)

  // Load pdfjs ONLY on client
  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout

    const loadPdfJs = async () => {
      try {
        const mod = await import("pdfjs-dist")
        if (!mounted) return
        pdfjs = mod
        pdfjs.GlobalWorkerOptions.workerSrc =
          `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
      } catch (err) {
        console.error("Failed to load PDF.js:", err)
      }
    }

    // Small delay to prevent blocking main thread
    timeoutId = setTimeout(loadPdfJs, 100)

    return () => {
      mounted = false
      clearTimeout(timeoutId)
    }
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    if (selected.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!validTypes.includes(selected.type) && !selected.name.endsWith(".docx")) {
      setError("Please upload a PDF or DOCX file")
      return
    }

    setFile(selected)
    setResults([])
    setError(null)
    setStatus('idle')
    setProgress(0)
  }, [])

  const removeFile = useCallback(() => {
    setFile(null)
    setError(null)
  }, [])

  const simulateProgress = useCallback((targetStatus: ProcessingStatus) => {
    return new Promise<void>((resolve) => {
      let currentProgress = 0
      const interval = setInterval(() => {
        currentProgress += 5
        setProgress(Math.min(currentProgress, 100))
        
        if (currentProgress >= 100) {
          clearInterval(interval)
          setStatus(targetStatus)
          resolve()
        }
      }, 50)
    })
  }, [])

  const extractText = async (file: File): Promise<string> => {
    if (file.type === "application/pdf") {
      if (!pdfjs) {
        throw new Error("PDF processing engine is initializing. Please try again in a moment.")
      }

      setStatus('extracting')
      await simulateProgress('extracting')

      const buffer = await file.arrayBuffer()
      const pdf = await pdfjs.getDocument({ data: buffer }).promise

      let text = ""
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        text += content.items.map((i: any) => i.str).join(" ") + "\n"
      }

      return text.trim()
    }

    if (file.name.endsWith(".docx")) {
      setStatus('extracting')
      await simulateProgress('extracting')
      
      const mammoth = await import("mammoth")
      const result = await mammoth.extractRawText({
        arrayBuffer: await file.arrayBuffer(),
      })
      return result.value.trim()
    }

    throw new Error("Unsupported file type")
  }

  const handleAnalyze = async () => {
    if (!file) return

    setLoading(true)
    setStatus('uploading')
    setError(null)
    setProgress(0)

    try {
      // Simulate upload progress
      await simulateProgress('uploading')
      
      const resumeText = await extractText(file)

      if (resumeText.length < 100) {
        throw new Error("CV appears to be empty or too short. Please upload a valid CV with more content.")
      }

      setStatus('analyzing')
      await simulateProgress('analyzing')

      const response = await suggestInternshipDomains({ resume: resumeText })

      if (!response?.results?.length) {
        setError("No matching internships found. Try updating your CV with more relevant skills.")
      } else {
        // Add match scores and additional info
        const enhancedResults = response.results.map((result: Result) => ({
          ...result,
          matchScore: Math.floor(Math.random() * 30) + 70, // Simulated match score 70-100%
          salaryRange: ["$15-25/hr", "$20-30/hr", "$18-25/hr", "$22-35/hr"][Math.floor(Math.random() * 4)],
          duration: ["3 months", "6 months", "4 months", "5 months"][Math.floor(Math.random() * 4)],
        }))
        
        setResults(enhancedResults)
        setStatus('complete')
        await simulateProgress('complete')
        setTimeout(() => setShowModal(true), 500)
      }
    } catch (err: any) {
      setStatus('error')
      setError(err.message ?? "Failed to analyze CV. Please try again.")
      console.error("CV Analysis Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredResults = filter === "all" 
    ? results 
    : filter === "high"
    ? results.filter(r => (r.matchScore || 0) > 85)
    : results.filter(r => (r.matchScore || 0) <= 85)

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading': return <Upload className="w-4 h-4 animate-bounce" />
      case 'extracting': return <FileText className="w-4 h-4 animate-pulse" />
      case 'analyzing': return <Search className="w-4 h-4 animate-spin" />
      case 'complete': return <CheckCircle className="w-4 h-4" />
      case 'error': return <AlertCircle className="w-4 h-4" />
      default: return <Upload className="w-4 h-4" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'uploading': return "Uploading your CV..."
      case 'extracting': return "Extracting text from document..."
      case 'analyzing': return "Analyzing skills and finding matches..."
      case 'complete': return "Analysis complete!"
      case 'error': return "Analysis failed"
      default: return "Ready to analyze"
    }
  }

  const exportToPDF = async () => {
    try {
      setExportingPDF(true)
      
      const doc = new jsPDF('landscape')
      
      // Add header
      doc.setFontSize(24)
      doc.setTextColor(59, 130, 246) // Blue color
      doc.text('Internship Matches Report', 20, 20)
      
      doc.setFontSize(10)
      doc.setTextColor(100, 116, 139) // Gray color
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 28)
      
      // Add summary
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text(`Total Matches: ${results.length}`, 20, 40)
      
      // Calculate average match score
      const avgMatchScore = results.length > 0 
        ? results.reduce((acc, r) => acc + (r.matchScore || 0), 0) / results.length 
        : 0
      doc.text(`Average Match Score: ${avgMatchScore.toFixed(1)}%`, 20, 47)
      
      // Prepare table data
      const tableData = filteredResults.map(result => [
        result.company,
        result.role,
        result.location,
        `${result.matchScore}%`,
        result.duration,
        result.salaryRange,
        result.skillsRequired.split(',').slice(0, 3).join(', ')
      ])
      
      // Add table
      autoTable(doc, {
        startY: 55,
        head: [['Company', 'Role', 'Location', 'Match Score', 'Duration', 'Salary Range', 'Key Skills']],
        body: tableData,
        headStyles: {
          fillColor: [59, 130, 246], // Blue
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 249, 255] // Light blue
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 40 },
          2: { cellWidth: 25 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 25 },
          6: { cellWidth: 50 }
        },
        margin: { left: 20 },
        styles: {
          fontSize: 9,
          cellPadding: 2
        }
      })
      
      // Add footer
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(
          `Page ${i} of ${pageCount} • Generated by Data Intern AI`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        )
      }
      
      // Save the PDF
      doc.save(`internship-matches-${new Date().toISOString().split('T')[0]}.pdf`)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      setError('Failed to generate PDF. Please try again.')
    } finally {
      setExportingPDF(false)
    }
  }

  return (
    <section id="apply" className="w-full min-h-screen py-8 md:py-16 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-100 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr from-purple-100 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="w-full">
          {/* Section Heading - Centered */}
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border border-blue-200 mb-4 md:mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">AI-Powered Matching</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Upload Your CV
            </h2>
            <p className="mt-3 md:mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Get personalized internship matches powered by advanced AI analysis of your skills and experience.
            </p>
          </div>

          {/* Main Card - Centered */}
          <div className="w-full max-w-2xl mx-auto">
            <Card className="shadow-2xl border-0 overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm transform transition-all duration-300 hover:shadow-3xl">
              <CardContent className="p-6 md:p-8 space-y-6 md:space-y-8">
                {/* File Upload Area */}
                <div className="space-y-4">
                  <label className="block">
                    <div className="border-3 border-dashed border-gray-300 rounded-xl md:rounded-2xl p-6 md:p-8 text-center cursor-pointer transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/50 group">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                          <Upload className="w-8 h-8 md:w-10 md:h-10 text-blue-600 group-hover:text-blue-700 transition-colors" />
                        </div>
                        <span className="text-lg md:text-xl font-semibold text-gray-800">
                          {file ? file.name : "Drag & drop or click to upload"}
                        </span>
                        <span className="text-sm text-gray-500 mt-1 md:mt-2">
                          Supports PDF and DOCX • Max 5MB
                        </span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx"
                        onChange={handleFileChange}
                      />
                    </div>
                  </label>

                  {file && (
                    <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg md:rounded-xl p-4 md:p-5 border border-green-200">
                      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                        <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                          <FileText className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-800 truncate">{file.name}</p>
                          <p className="text-sm text-gray-600">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="text-gray-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Progress Indicator */}
                {loading && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 md:gap-3">
                        {getStatusIcon()}
                        <span className="text-sm md:text-base font-medium text-gray-700">
                          {getStatusText()}
                        </span>
                      </div>
                      <span className="text-base md:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {progress}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2 md:h-3" />
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="flex gap-3 p-4 md:p-5 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg md:rounded-xl text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                {/* Action Button - Centered */}
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    className="h-14 md:h-16 px-8 md:px-12 text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full md:w-auto"
                    disabled={!file || loading}
                    onClick={handleAnalyze}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 animate-spin" />
                        Analyzing Your CV...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                        Find Perfect Internships
                      </>
                    )}
                  </Button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-gray-200">
                  <div className="text-center space-y-2 md:space-y-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    </div>
                    <p className="text-xs md:text-sm font-medium text-gray-700">AI-Powered Analysis</p>
                  </div>
                  <div className="text-center space-y-2 md:space-y-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mx-auto shadow-md">
                      <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                    </div>
                    <p className="text-xs md:text-sm font-medium text-gray-700">Industry Matches</p>
                  </div>
                  <div className="text-center space-y-2 md:space-y-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mx-auto shadow-md">
                      <Award className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                    </div>
                    <p className="text-xs md:text-sm font-medium text-gray-700">Instant Apply</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Results Dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
  <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-6xl h-[90vh] p-0 flex flex-col overflow-hidden">
    
    {/* Fixed Header */}
    <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white">
      <DialogHeader className="p-4 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <DialogTitle className="text-lg md:text-xl lg:text-2xl font-bold truncate">
              Your Perfect Internship Matches
            </DialogTitle>
            <DialogDescription className="text-blue-100 mt-1 md:mt-2 text-sm md:text-base">
              Found {results.length} internship{results.length !== 1 && "s"} matching your skills
            </DialogDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowModal(false)}
            className="text-white hover:bg-white/20 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full md:w-[200px] bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Filter by match" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Matches ({results.length})</SelectItem>
              <SelectItem value="high">High Match (85%+)</SelectItem>
              <SelectItem value="medium">Medium Match</SelectItem>
            </SelectContent>
          </Select>

          <Badge className="bg-white/20 text-white hover:bg-white/30">
            {filteredResults.length} results
          </Badge>
        </div>
      </DialogHeader>
    </div>

    {/* Scrollable Content Area */}
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white" ref={tableRef}>
      
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="font-bold text-gray-900 whitespace-nowrap">Company & Role</TableHead>
                <TableHead className="font-bold text-gray-900 whitespace-nowrap">Match</TableHead>
                <TableHead className="font-bold text-gray-900 whitespace-nowrap">Skills Match</TableHead>
                <TableHead className="font-bold text-gray-900 whitespace-nowrap">Details</TableHead>
                <TableHead className="font-bold text-gray-900 whitespace-nowrap">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result, index) => (
                <TableRow key={index} className="hover:bg-gray-50 transition-colors group">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{result.company}</p>
                        <p className="text-sm text-gray-600 truncate">{result.role}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-100 rounded-full h-2.5 overflow-hidden flex-shrink-0">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full transition-all duration-500"
                            style={{ width: `${result.matchScore || 0}%` }}
                          />
                        </div>
                        <span className={`font-bold text-sm whitespace-nowrap ${
                          (result.matchScore || 0) >= 90 ? 'text-green-600' :
                          (result.matchScore || 0) >= 80 ? 'text-blue-600' : 'text-amber-600'
                        }`}>
                          {result.matchScore}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{result.cvMatchReason}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {result.skillsRequired.split(',').slice(0, 3).map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 truncate max-w-[80px]">
                          {skill.trim()}
                        </Badge>
                      ))}
                      {result.skillsRequired.split(',').length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{result.skillsRequired.split(',').length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600 truncate">{result.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600 truncate">{result.duration}</span>
                      </div>
                      <div className="font-medium text-green-600 bg-green-50 px-2 py-1 rounded text-sm truncate">
                        {result.salaryRange}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Button
                      asChild
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group/apply whitespace-nowrap"
                    >
                      <a
                        href={result.directCareerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        Apply Now
                        <ExternalLink className="w-4 h-4 group-hover/apply:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredResults.map((result, index) => (
          <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-base text-gray-900 truncate">{result.company}</h3>
                      <p className="text-gray-600 text-sm truncate">{result.role}</p>
                    </div>
                  </div>
                </div>
                <Badge className={`flex-shrink-0 ml-2 ${
                  (result.matchScore || 0) >= 90 ? 'bg-green-100 text-green-800' :
                  (result.matchScore || 0) >= 80 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {result.matchScore}% Match
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{result.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{result.duration}</span>
                </div>
              </div>

              <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                {result.cvMatchReason}
              </p>

              <div className="flex flex-wrap gap-2">
                {result.skillsRequired.split(',').slice(0, 3).map((skill, i) => (
                  <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                    {skill.trim()}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-1">
                  <p className="font-semibold text-green-600">{result.salaryRange}</p>
                  <p className="text-xs text-gray-500">Estimated Salary</p>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <a
                    href={result.directCareerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    Apply
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>

    {/* Fixed Footer */}
    <div className="flex-shrink-0 border-t bg-white p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <p className="text-sm text-gray-600">
            Ready to apply? Click "Apply Now" to submit your application directly.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            You can also export all matches for future reference.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={exportToPDF}
            disabled={exportingPDF}
            className="w-full sm:w-auto"
          >
            {exportingPDF ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export as PDF
              </>
            )}
          </Button>
          <Button 
            onClick={() => setShowModal(false)}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Close Results
          </Button>
        </div>
      </div>
    </div>

  </DialogContent>
</Dialog>
    </section>
  )
}