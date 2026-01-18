import React from 'react';
import { motion } from 'framer-motion';
import { Download, ExternalLink } from 'lucide-react';

interface PaperReaderProps {
    pdfUrl?: string;
}

export const PaperReader: React.FC<PaperReaderProps> = ({
    pdfUrl = "/paper.pdf"
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full bg-white flex flex-col overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-neutral-50 shrink-0">
                <h2 className="text-lg font-semibold text-gray-800">Research Paper</h2>
                <div className="flex items-center gap-2">
                    <a
                        href={pdfUrl}
                        download
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                        title="Download PDF"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Download</span>
                    </a>
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                        title="Open in New Tab"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span className="hidden sm:inline">New Tab</span>
                    </a>
                </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 bg-gray-100 relative">
                <iframe
                    src={pdfUrl}
                    className="w-full h-full border-0"
                    title="Research Paper PDF"
                />
            </div>
        </motion.div>
    );
};
