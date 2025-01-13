import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Download } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const Reports = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedHostel, setSelectedHostel] = useState<string>("");
  const { toast } = useToast();

  const handleGenerateReport = () => {
    if (!startDate || !endDate || !selectedHostel) {
      toast({
        title: "Missing Information",
        description: "Please select all required fields to generate the report.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically make an API call to generate the PDF
    console.log("Generating report for:", {
      startDate,
      endDate,
      selectedHostel,
    });

    toast({
      title: "Report Generated",
      description: "Your report has been generated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Report Parameters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Hostel
              </label>
              <Select
                value={selectedHostel}
                onValueChange={setSelectedHostel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hostel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hostel1">Block A</SelectItem>
                  <SelectItem value="hostel2">Block B</SelectItem>
                  <SelectItem value="hostel3">Block C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                className="rounded-md border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                className="rounded-md border"
              />
            </div>
            <Button
              onClick={handleGenerateReport}
              className="w-full"
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Recent Reports</h3>
          <div className="space-y-4">
            {[
              {
                id: 1,
                name: "March 2024 Report",
                date: "2024-03-31",
                hostel: "Block A",
              },
              {
                id: 2,
                name: "February 2024 Report",
                date: "2024-02-29",
                hostel: "Block B",
              },
            ].map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{report.name}</h4>
                  <p className="text-sm text-gray-500">
                    {report.hostel} - {format(new Date(report.date), "PP")}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;