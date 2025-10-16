import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay } from 'date-fns';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const CalendarComponent = ({ isDetailPage = true }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [events, setEvents] = useState([]); // Array of events { date: Date, title: string, color: string }
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventDate, setNewEventDate] = useState(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventColor, setNewEventColor] = useState('#3B82F6'); // Default to blue
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    setCurrentDate(new Date(selectedYear, selectedMonth, 1));
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handlePrevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear());
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear());
  };

  const addEvent = () => {
    if (newEventTitle.trim()) {
      setEvents((prev) => [...prev, { date: newEventDate, title: newEventTitle, color: newEventColor }]);
      setIsAddingEvent(false);
      setNewEventDate(null);
      setNewEventTitle('');
      setNewEventColor('#3B82F6');
    }
  };

  const getEventsForDate = (date) => {
    return events.filter((event) => isSameDay(event.date, date));
  };

  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
      <div className="flex gap-2 mb-2 sm:mb-0">
        <button
          onClick={handlePrevMonth}
          className={`px-3 py-1 rounded-lg font-medium text-sm transition-colors ${
            theme === 'dark'
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          aria-label="Previous month"
        >
          Prev
        </button>
        <button
          onClick={handleNextMonth}
          className={`px-3 py-1 rounded-lg font-medium text-sm transition-colors ${
            theme === 'dark'
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          aria-label="Next month"
        >
          Next
        </button>
      </div>
      <div className="flex gap-2">
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className={`p-1 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${
            theme === 'dark' ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
          }`}
          aria-label="Select month"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {format(new Date(0, i), 'MMMM')}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className={`p-1 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${
            theme === 'dark' ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
          }`}
          aria-label="Select year"
        >
          {Array.from({ length: 10 }, (_, i) => {
            const year = new Date().getFullYear() - 5 + i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentDate);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          key={i}
          className={`text-center p-1 font-medium text-xs ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          } ${isDetailPage ? '' : 'hidden'}`}
        >
          {format(addDays(startDate, i), 'eee')}
        </div>
      );
    }
    return <div className="grid grid-cols-7 gap-px">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'd');
        const cloneDay = day;
        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
        const eventsOnDay = getEventsForDate(day);
        const hasEvents = eventsOnDay.length > 0;
        const backgroundColor = hasEvents ? eventsOnDay[0].color : '';
        days.push(
          <div
            key={day.toString()}
            className={`relative aspect-square ${
              isDetailPage ? '' : 'h-10'
            } flex items-center justify-center border text-center cursor-pointer transition-colors ${
              theme === 'dark'
                ? isCurrentMonth
                  ? hasEvents
                    ? 'border-gray-600 text-white'
                    : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                  : hasEvents
                  ? 'border-gray-600 text-white'
                  : 'border-gray-600 bg-gray-900 text-gray-500'
                : isCurrentMonth
                ? hasEvents
                  ? 'border-gray-200 text-white'
                  : 'border-gray-200 bg-white hover:bg-gray-100'
                : hasEvents
                ? 'border-gray-200 text-white'
                : 'border-gray-200 bg-gray-50 text-gray-400'
            }`}
            style={hasEvents ? { backgroundColor } : {}}
            onClick={() => isDetailPage && setIsAddingEvent(true) && setNewEventDate(cloneDay)}
            role="button"
            aria-label={`Day ${formattedDate}${hasEvents ? ' with events' : ''}`}
          >
            <span className={`text-xs ${isDetailPage ? 'sm:text-sm' : ''}`}>{formattedDate}</span>
            {hasEvents && (
              <div
                className={`absolute z-10 hidden group-hover:block ${
                  isDetailPage ? 'p-2' : 'p-1'
                } bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-2 border ${
                  theme === 'dark' ? 'text-white border-gray-600' : 'text-gray-800 border-gray-200'
                }`}
              >
                {eventsOnDay.map((event) => (
                  <p key={event.title} className={`text-xs ${isDetailPage ? '' : 'text-[10px]'}`}>
                    {event.title}
                  </p>
                ))}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day.toString()} className="grid grid-cols-7 gap-px">{days}</div>);
      days = [];
    }
    return <div className="bg-gray-200 dark:bg-gray-600">{rows}</div>;
  };

  return (
    <div
      className={`w-full rounded-lg shadow-lg ${
        isDetailPage
          ? theme === 'dark'
            ? 'bg-gray-900 p-4 min-h-[400px]'
            : 'bg-white p-4 min-h-[400px]'
          : theme === 'dark'
          ? 'bg-gray-800 p-2 h-48 overflow-hidden'
          : 'bg-gray-100 p-2 h-48 overflow-hidden'
      }`}
    >
      <h2
        className={`text-lg font-bold mb-3 ${
          isDetailPage ? 'text-2xl' : 'text-base'
        } ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
      >
        Calendar
      </h2>
      {isDetailPage && renderHeader()}
      {renderDays()}
      <div className="group">{renderCells()}</div>
      <AnimatePresence>
        {isAddingEvent && isDetailPage && (
          <motion.div
            className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`p-5 rounded-lg shadow-xl w-80 ${
                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-base font-bold mb-3">Add Event</h3>
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Event Title"
                className={`w-full p-2 border rounded-lg text-sm mb-3 focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
                }`}
                aria-label="Event title"
              />
              <input
                type="color"
                value={newEventColor}
                onChange={(e) => setNewEventColor(e.target.value)}
                className="w-full h-8 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
                aria-label="Event color"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAddingEvent(false)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    theme === 'dark' ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  aria-label="Cancel event"
                >
                  Cancel
                </button>
                <button
                  onClick={addEvent}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-200 text-gray-800 hover:bg-blue-300'
                  }`}
                  aria-label="Add event"
                >
                  Add
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarComponent;