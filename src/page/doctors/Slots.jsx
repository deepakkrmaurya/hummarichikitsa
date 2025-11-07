import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAvailability,
  addBulkAvailability,
  removeAvailability,
  getDoctorAvailability,
  setSelectedDate,
  clearError,
  clearMessage,
} from "../../Redux/availabilitySlice";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  X,
  Grid3X3,
  List,
  Table,
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  CalendarRange,
} from "lucide-react";
import toast from "react-hot-toast";

const Availability = () => {
  const dispatch = useDispatch();
  const { availability, loading, error, message, selectedDate } = useSelector(
    (state) => state?.availability
  );

  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [selectedDates, setSelectedDates] = useState([]);
  const [view, setView] = useState("weekly");
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [localMessage, setLocalMessage] = useState({ text: "", type: "" });
  const [bulkMode, setBulkMode] = useState("single");
  const { isLoggedIn, data } = useSelector((store) => store.LoginAuth || {});
 
  // Mock current doctor - Replace with actual doctor data from your app
  const [currentDoctor] = useState({
    _id: localStorage.getItem("doctorId") || "doctor123",
    name: "Dr. John Doe",
    specialty: "Cardiologist",
  });

  // Initialize selected date
  useEffect(() => {
    if (!selectedDate && bulkMode === "single") {
      const today = new Date().toISOString().split("T")[0];
      dispatch(setSelectedDate(today));
    }
  }, [selectedDate, bulkMode, dispatch]);

  // Load availability on component mount
  useEffect(() => {
    if (currentDoctor?._id) {
      dispatch(getDoctorAvailability(data._id));
    }
  }, [data?._id, dispatch]);

  // Handle Redux messages and errors
  useEffect(() => {
    if (message) {
      setLocalMessage({ text: message, type: "success" });
      dispatch(clearMessage());
    }
    if (error) {
      setLocalMessage({ text: error, type: "error" });
      dispatch(clearError());
    }
  }, [message, error, dispatch]);

  // Time formatting function
  const formatTimeForDisplay = (time) => {
    try {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);

      if (isNaN(hour)) return time;

      if (hour === 0) {
        return `12:${minutes} AM`;
      } else if (hour === 12) {
        return `12:${minutes} PM`;
      } else if (hour > 12) {
        return `${hour - 12}:${minutes} PM`;
      } else {
        return `${hour}:${minutes} AM`;
      }
    } catch (error) {
      return time;
    }
  };

  // Get display format from availability data
  const getDisplayFromAvailability = (availabilityItem) => {
    if (
      !availabilityItem ||
      !availabilityItem.display ||
      availabilityItem.display.length === 0
    ) {
      return "Not Set";
    }
    return availabilityItem.display[0]; // Assuming display array has one item with the time range
  };

  // Handle Add Availability
  const handleAddAvailability = async () => {
    if (!startTime || !endTime) {
      toast.error("Please select start time and end time", "error");
      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time", "error");
      return;
    }

    if (bulkMode === "single" && !selectedDate) {
      toast.error("Please select a date", "error");
      return;
    }

    if (bulkMode === "multiple" && selectedDates.length === 0) {
      toast.error("Please select at least one date", "error");
      return;
    }

    try {
      let result;

      if (bulkMode === "single") {
         
        result = await dispatch(
          addAvailability({
            doctorId: data._id,
            date: selectedDate,
            startTime,
            endTime,
          })
        ).unwrap();
      } else if (bulkMode === "multiple") {
        result = await dispatch(
          addBulkAvailability({
            doctorId: currentDoctor._id,
            dates: selectedDates,
            startTime,
            endTime,
          })
        ).unwrap();
      }

      if (result) {
        showMessage(result.message, "success");

        // Refresh availability data
        dispatch(getDoctorAvailability(currentDoctor._id));

        if (bulkMode === "multiple") {
          setSelectedDates([]);
        }
      }
    } catch (error) {
      showMessage(error, "error");
    }
  };

  // Handle Delete Availability
  const handleDeleteAvailability = async () => {
    if (bulkMode === "single" && !selectedDate) {
      showMessage("Please select a date", "error");
      return;
    }

    if (bulkMode === "multiple" && selectedDates.length === 0) {
      showMessage("Please select at least one date", "error");
      return;
    }

    let confirmationMessage = "";
    let datesToDelete = [];

    if (bulkMode === "single") {
      datesToDelete = [selectedDate];
      confirmationMessage =
        "Are you sure you want to remove availability for this date?";
    } else if (bulkMode === "multiple") {
      datesToDelete = selectedDates;
      confirmationMessage = `Are you sure you want to remove availability for ${selectedDates.length} selected dates?`;
    }

    if (!window.confirm(confirmationMessage)) {
      return;
    }

    try {
      const result = await dispatch(
        removeAvailability({
          doctorId: currentDoctor._id,
          dates: datesToDelete,
        })
      ).unwrap();

      showMessage(result.message, "success");

      // Refresh availability data
      dispatch(getDoctorAvailability(currentDoctor._id));

      if (bulkMode === "multiple") {
        setSelectedDates([]);
      }
    } catch (error) {
      showMessage(error, "error");
    }
  };

  // Handle date selection
  const handleDateSelect = (dateStr) => {
    if (bulkMode === "single") {
      dispatch(setSelectedDate(dateStr));
    } else if (bulkMode === "multiple") {
      setSelectedDates((prev) => {
        const isAlreadySelected = prev.includes(dateStr);
        if (isAlreadySelected) {
          return prev.filter((date) => date !== dateStr);
        } else {
          return [...prev, dateStr];
        }
      });
    }
  };

  // Clear all selected dates
  const clearSelectedDates = () => {
    setSelectedDates([]);
    showMessage("Selection cleared", "success");
  };

  // Show message function
  const showMessage = (text, type) => {
    setLocalMessage({ text, type });
    setTimeout(() => setLocalMessage({ text: "", type: "" }), 5000);
  };

  // Calendar functions
  const getWeekDates = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  };

  const getMonthDates = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const dates = [];
    for (
      let day = new Date(firstDay);
      day <= lastDay;
      day.setDate(day.getDate() + 1)
    ) {
      dates.push(new Date(day));
    }
    return dates;
  };

  const navigateWeek = (direction) => {
    setCurrentWeek((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + direction * 7);
      return newDate;
    });
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const getAvailabilityForDate = (dateStr) => {
    return availability?.find((avail) => avail.date === dateStr);
  };

  const refreshData = () => {
    dispatch(getDoctorAvailability(currentDoctor._id));
    showMessage("Data refreshed successfully", "success");
  };

  // Availability data for summary
  const getAvailabilityData = () => {
    const availabilityList = [];
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Today's availability
    const todayAvailability = availability?.find(
      (avail) => avail.date === today
    );
    if (todayAvailability) {
      availabilityList.push({
        date: "Today",
        dateStr: today,
        display: getDisplayFromAvailability(todayAvailability),
        type: "today",
        isActive: true,
      });
    }

    // Yesterday's availability
    const yesterdayAvailability = availability?.find(
      (avail) => avail.date === yesterdayStr
    );
    if (yesterdayAvailability) {
      availabilityList.push({
        date: "Yesterday",
        dateStr: yesterdayStr,
        display: getDisplayFromAvailability(yesterdayAvailability),
        type: "yesterday",
        isActive: false,
      });
    }

    // Upcoming availability (next 7 days)
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);
      const futureDateStr = futureDate.toISOString().split("T")[0];

      const futureAvailability = availability?.find(
        (avail) => avail.date === futureDateStr
      );
      if (futureAvailability) {
        availabilityList.push({
          date: futureDate.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          dateStr: futureDateStr,
          display: getDisplayFromAvailability(futureAvailability),
          type: "upcoming",
          isActive: true,
        });
      }
    }

    return availabilityList;
  };

  // Stats calculation
  const getTotalAvailabilityDays = () => {
    return availability?.length;
  };

  const getUpcomingAvailability = () => {
    const today = new Date().toISOString().split("T")[0];
    return availability?.filter((avail) => avail.date >= today).length;
  };

  const getTodaysAvailability = () => {
    const today = new Date().toISOString().split("T")[0];
    return availability?.some((avail) => avail.date === today);
  };

  const handleNoteClick = (dateStr, isActive = true) => {
    if (isActive) {
      if (bulkMode === "single") {
        dispatch(setSelectedDate(dateStr));
      } else if (bulkMode === "multiple") {
        handleDateSelect(dateStr);
      }
      setView("weekly");
    }
  };

  const weekDates = getWeekDates(currentWeek);
  const monthDates = getMonthDates(currentMonth);
  const availabilityData = getAvailabilityData();
  const selectedDateAvailability = getAvailabilityForDate(selectedDate);

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className=" mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Manage Availability
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Set your available timings for patient appointments
              </p>
            </div>
            {currentDoctor && (
              <div className="flex items-center gap-3">
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">
                    Dr. {currentDoctor.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentDoctor.specialty}
                  </p>
                </div>
                <button
                  onClick={refreshData}
                  disabled={loading}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Refresh data"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Message Alert */}
        {localMessage.text && (
          <div
            className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg flex items-center ${localMessage.type === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
              }`}
          >
            {localMessage.type === "error" ? (
              <AlertCircle className="w-4 h-4 mr-2" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            )}
            {localMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar - Availability Management */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Add Availability Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Set Availability
                </h2>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Bulk Mode Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Set For
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setBulkMode("single");
                        setSelectedDates([]);
                      }}
                      className={`py-2 px-2 text-xs font-medium rounded-lg flex items-center justify-center ${bulkMode === "single"
                          ? "bg-blue-100 text-blue-700 border border-blue-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Single Day
                    </button>
                    <button
                      onClick={() => {
                        setBulkMode("multiple");
                        dispatch(setSelectedDate(""));
                      }}
                      className={`py-2 px-2 text-xs font-medium rounded-lg flex items-center justify-center ${bulkMode === "multiple"
                          ? "bg-blue-100 text-blue-700 border border-blue-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      <CalendarRange className="w-3 h-3 mr-1" />
                      Multiple Days
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeForDisplay(startTime)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeForDisplay(endTime)}
                    </p>
                  </div>
                </div>

                {/* Selected Dates Info */}
                {bulkMode === "multiple" && (
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-yellow-700">
                        Selected Dates: {selectedDates.length}
                      </p>
                      {selectedDates.length > 0 && (
                        <button
                          onClick={clearSelectedDates}
                          className="text-xs text-yellow-600 hover:text-yellow-800"
                          title="Clear selection"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    {selectedDates.length > 0 ? (
                      <div className="text-xs text-yellow-600 max-h-20 overflow-y-auto">
                        {selectedDates.map((date, index) => (
                          <span
                            key={index}
                            className="inline-block bg-white px-2 py-1 rounded mr-1 mb-1 border border-yellow-300"
                          >
                            {new Date(date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-yellow-600">
                        Click on dates in the calendar to select multiple days
                      </p>
                    )}
                  </div>
                )}

                {/* Availability Preview */}
                {startTime && endTime && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-700 mb-2">
                      Availability Preview:
                    </p>
                    <p className="text-lg font-bold text-blue-800">
                      {formatTimeForDisplay(startTime)} -{" "}
                      {formatTimeForDisplay(endTime)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Patients can book appointments during this time range
                    </p>
                  </div>
                )}

                <div className="flex space-x-2 sm:space-x-3">
                  <button
                    onClick={handleAddAvailability}
                    disabled={
                      loading ||
                      !startTime ||
                      !endTime ||
                      (bulkMode === "single" && !selectedDate) ||
                      (bulkMode === "multiple" && selectedDates.length === 0)
                    }
                    className="flex-1 bg-green-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
                  >
                    {loading ? (
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mr-1 sm:mr-2" />
                    ) : (
                      <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    )}
                    {bulkMode === "single"
                      ? "Set Availability"
                      : `Set for ${selectedDates.length} Days`}
                  </button>

                  {(selectedDate &&
                    selectedDateAvailability &&
                    bulkMode === "single") ||
                    (selectedDates.length > 0 && bulkMode === "multiple") ? (
                    <button
                      onClick={handleDeleteAvailability}
                      disabled={loading}
                      className="px-2 sm:px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 flex items-center text-sm"
                      title={`Remove availability for ${bulkMode === "single" ? "this date" : "selected dates"
                        }`}
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>



            {/* View Toggle */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                View Options
              </h3>
              <div className="grid grid-cols-3 gap-1 sm:gap-2">
                <button
                  onClick={() => setView("weekly")}
                  className={`py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center ${view === "weekly"
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <Table className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Weekly
                </button>
                <button
                  onClick={() => setView("monthly")}
                  className={`py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center ${view === "monthly"
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <Grid3X3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Monthly
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Calendar Views */}
          <div className="lg:col-span-2">
            {/* Weekly View */}
            {view === "weekly" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Weekly Calendar
                  </h2>
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <button
                      onClick={() => navigateWeek(-1)}
                      className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <span className="font-medium text-gray-700 text-sm sm:text-base">
                      {currentWeek.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      - Week {Math.ceil(currentWeek.getDate() / 7)}
                    </span>
                    <button
                      onClick={() => navigateWeek(1)}
                      className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-xs sm:text-sm font-medium text-gray-500 py-1 sm:py-2 bg-gray-50 rounded"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {weekDates.map((date, index) => {
                    const dateStr = formatDate(date);
                    const dayAvailability = getAvailabilityForDate(dateStr);
                    const isToday =
                      dateStr === new Date().toISOString().split("T")[0];
                    const isSelected =
                      bulkMode === "single"
                        ? dateStr === selectedDate
                        : selectedDates.includes(dateStr);
                    const hasAvailability = !!dayAvailability;

                    return (
                      <div
                        key={index}
                        className={`min-h-24 sm:min-h-32 border-2 rounded-lg p-1 sm:p-2 cursor-pointer transition-all duration-200 ${isToday
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : isSelected
                              ? "border-green-500 bg-green-50 shadow-md"
                              : hasAvailability
                                ? "border-green-200 bg-green-25 hover:border-green-300"
                                : "border-gray-200 hover:border-gray-300"
                          }`}
                        onClick={() => handleDateSelect(dateStr)}
                      >
                        <div className="text-center mb-1 sm:mb-2">
                          <div
                            className={`text-xs sm:text-sm font-medium ${isToday
                                ? "text-blue-700"
                                : isSelected
                                  ? "text-green-700"
                                  : "text-gray-700"
                              }`}
                          >
                            {date.getDate()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {date.toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </div>
                        </div>
                        <div className="space-y-1">
                          {hasAvailability ? (
                            <>
                              <div className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded text-center truncate">
                                {getDisplayFromAvailability(dayAvailability)}
                              </div>
                              <div className="text-xs text-green-600 font-medium text-center">
                                Available
                              </div>
                            </>
                          ) : (
                            <div className="text-xs text-gray-400 text-center py-4">
                              Not Set
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Monthly View */}
            {view === "monthly" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Monthly Calendar
                  </h2>
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <span className="font-medium text-gray-700 text-sm sm:text-base">
                      {currentMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-500 py-1 sm:py-2 bg-gray-50 rounded"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                  {monthDates.map((date, index) => {
                    const dateStr = formatDate(date);
                    const dayAvailability = getAvailabilityForDate(dateStr);
                    const isToday =
                      dateStr === new Date().toISOString().split("T")[0];
                    const isSelected =
                      bulkMode === "single"
                        ? dateStr === selectedDate
                        : selectedDates.includes(dateStr);
                    const isCurrentMonth =
                      date.getMonth() === currentMonth.getMonth();
                    const hasAvailability = !!dayAvailability;

                    return (
                      <div
                        key={index}
                        className={`min-h-12 sm:min-h-20 border rounded p-0.5 sm:p-1 cursor-pointer transition-all duration-200 ${isToday
                            ? "border-blue-500 bg-blue-50 shadow-inner"
                            : isSelected
                              ? "border-green-500 bg-green-50 shadow-inner"
                              : hasAvailability
                                ? "border-green-200 bg-green-25 hover:border-green-300"
                                : "border-gray-200 hover:border-gray-300"
                          } ${!isCurrentMonth ? "opacity-40 bg-gray-50" : ""}`}
                        onClick={() => handleDateSelect(dateStr)}
                      >
                        <div className="flex justify-between items-start">
                          <span
                            className={`text-xs ${isToday
                                ? "bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                : isSelected
                                  ? "text-green-700 font-bold"
                                  : "text-gray-700"
                              }`}
                          >
                            {date.getDate()}
                          </span>
                          {hasAvailability && (
                            <span className="text-xs bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                              ✓
                            </span>
                          )}
                        </div>
                        {hasAvailability && isCurrentMonth && (
                          <div className="mt-1">
                            <div className="text-xs text-green-600 font-medium text-center truncate">
                              Available
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Availability Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Availability Summary
                </h2>
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {availabilityData.length} days
                </div>
              </div>

              {availabilityData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <UserCheck className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No availability set yet</p>
                  <p className="text-xs mt-1">
                    Set your availability to see summary
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {availabilityData.map((avail, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-3 transition-all duration-200 cursor-pointer ${avail.type === "today"
                          ? "border-green-300 bg-green-50 hover:bg-green-100"
                          : avail.type === "yesterday"
                            ? "border-gray-300 bg-gray-50 hover:bg-gray-100"
                            : "border-blue-300 bg-blue-50 hover:bg-blue-100"
                        } ${avail.isActive ? "hover:shadow-md" : "opacity-70"}`}
                      onClick={() =>
                        handleNoteClick(avail.dateStr, avail.isActive)
                      }
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className={`text-sm font-medium ${avail.type === "today"
                              ? "text-green-800"
                              : avail.type === "yesterday"
                                ? "text-gray-700"
                                : "text-blue-800"
                            }`}
                        >
                          {avail.date}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${avail.type === "today"
                              ? "bg-green-200 text-green-800"
                              : avail.type === "yesterday"
                                ? "bg-gray-200 text-gray-700"
                                : "bg-blue-200 text-blue-800"
                            }`}
                        >
                          Available
                        </span>
                      </div>
                      <div
                        className={`text-xs ${avail.type === "today"
                            ? "text-green-600"
                            : avail.type === "yesterday"
                              ? "text-gray-600"
                              : "text-blue-600"
                          } font-medium`}
                      >
                        {avail.display}
                      </div>
                      {avail.type === "upcoming" && (
                        <div className="text-xs text-blue-500 mt-1">
                          Click to view details
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Availability;