// Set today's date as default
        document.getElementById('date').valueAsDate = new Date();

        let timeRecords = [];

        function calculateTime() {
            // Get input values
            const date = document.getElementById('date').value;
            const startTime = document.getElementById('startTime').value;
            const endTime = document.getElementById('endTime').value;
            const breakTime = parseInt(document.getElementById('breakTime').value);
            const localTravel = parseInt(document.getElementById('localTravel').value);
            const intTravel = parseFloat(document.getElementById('intTravel').value);
            const isInternational = document.getElementById('isInternational').checked;

            // Convert times to minutes since midnight
            const [startHours, startMinutes] = startTime.split(':');
            const [endHours, endMinutes] = endTime.split(':');
            
            const startMinutesSinceMidnight = parseInt(startHours) * 60 + parseInt(startMinutes);
            const endMinutesSinceMidnight = parseInt(endHours) * 60 + parseInt(endMinutes);

            // Calculate work time in minutes
            let workMinutes = endMinutesSinceMidnight - startMinutesSinceMidnight - breakTime;
            
            // Calculate plus hours (anything over 8 hours)
            const regularMinutes = 8 * 60; // 8 hours in minutes
            const plusMinutes = Math.max(0, workMinutes - regularMinutes);

            // Calculate travel times
            const localTravelTotal = localTravel * 2;
            const intTravelTotal = isInternational ? intTravel * 60 : 0; // Convert hours to minutes

            // Calculate total time
            const totalMinutes = workMinutes + localTravelTotal + intTravelTotal;

            // Check for warning
            const warning = document.getElementById('warning');
            if (workMinutes >= 9 * 60) { // 9 hours in minutes
                warning.classList.remove('hidden');
            } else {
                warning.classList.add('hidden');
            }

            // Format results
            const formatTime = (minutes) => {
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                return `${hours}h ${mins}m`;
            };

            // Store record
            const record = {
                date: date,
                workHours: formatTime(workMinutes),
                plusHours: formatTime(plusMinutes),
                localTravel: formatTime(localTravelTotal),
                intTravel: formatTime(intTravelTotal),
                totalTime: formatTime(totalMinutes)
            };
            timeRecords.unshift(record);

            // Display results
            document.getElementById('results').classList.remove('hidden');
            document.getElementById('totalWorkTime').textContent = `Total Work Time: ${formatTime(workMinutes)}`;
            document.getElementById('productiveTime').textContent = `Regular Hours: ${formatTime(Math.min(workMinutes, regularMinutes))}`;
            document.getElementById('plusHours').textContent = `Plus Hours: ${formatTime(plusMinutes)}`;
            document.getElementById('localTravelTime').textContent = `Local Travel Time: ${formatTime(localTravelTotal)}`;
            document.getElementById('internationalTravelTime').textContent = `International Travel Time: ${formatTime(intTravelTotal)}`;
            document.getElementById('totalTime').textContent = `Total Time: ${formatTime(totalMinutes)}`;

            updateRecordsTable();
        }

        function updateRecordsTable() {
            const table = document.getElementById('records');
            const tbody = document.getElementById('recordsBody');
            table.classList.remove('hidden');
            
            tbody.innerHTML = timeRecords.map(record => `
                <tr>
                    <td>${record.date}</td>
                    <td>${record.workHours}</td>
                    <td>${record.plusHours}</td>
                    <td>${record.localTravel}</td>
                    <td>${record.intTravel}</td>
                    <td>${record.totalTime}</td>
                </tr>
            `).join('');
        }

        function exportToCSV() {
            if (timeRecords.length === 0) {
                alert('No data to export');
                return;
            }

            const headers = ['Date', 'Work Hours', 'Plus Hours', 'Local Travel', 'International Travel', 'Total Time'];
            const csvContent = [
                headers.join(','),
                ...timeRecords.map(record => [
                    record.date,
                    record.workHours,
                    record.plusHours,
                    record.localTravel,
                    record.intTravel,
                    record.totalTime
                ].join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `work_hours_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
