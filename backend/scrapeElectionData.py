from bs4 import BeautifulSoup
import requests
import json

wholeData = []

def getResults(response):
    votesCountArray = []
    top_4_ids = []
    top_4_counts = []
    top_4_candidates = []
    allData = []

    html_text = response.text

    soup = BeautifulSoup(html_text, 'lxml')
    votesTable = soup.find_all('table', class_ = 'table select-table')[1]
    votesP = votesTable.find_all('p')
    validVotesCount = votesP[1].text.replace(",", "")
    validVotesPercentage = votesP[2].text.replace(",", "")
    rejectedVotesCount = votesP[4].text.replace(",", "")
    rejectedVotesPercentage = votesP[5].text.replace(",", "")
    totalPolledCount = votesP[7].text.replace(",", "")
    totalPolledPercentage = votesP[8].text.replace(",", "")
    totalElectorsCount = votesP[10].text.replace(",", "")

    allData.append(validVotesCount)
    allData.append(validVotesPercentage)
    allData.append(rejectedVotesCount)
    allData.append(rejectedVotesPercentage)
    allData.append(totalPolledCount)
    allData.append(totalPolledPercentage)
    allData.append(totalElectorsCount)

    votesTable = soup.find_all('table', class_ = 'table select-table')[0]
    votesTableRow = votesTable.find_all('tr')
    numberOfCandidates = len(votesTableRow)

    votesCount = votesTable.find_all('p')

    for i in range(0, (numberOfCandidates-1)*2, 2):
        votesCount = int(votesTable.find_all('p')[i].text.replace(",", ""))
        votesCountArray.append(votesCount)

    top_4 = sorted(enumerate(votesCountArray), key=lambda x: x[1], reverse=True)[:4]

    for id, count in top_4:
        top_4_ids.append(id)
        top_4_counts.append(count)

    allData.append(top_4_counts)

    otherCount = sum(votesCountArray) - sum(top_4_counts)
    allData.append(otherCount)

    candidateNames = votesTable.find_all('h6')
    for i in top_4_ids:
        top_4_candidates.append(candidateNames[i*2].text.title())

    allData.append(top_4_candidates)

    return allData


def getPreferenceResults(districtName):
    votesCountArray = []
    top_2_ids = []
    top_2_counts = []
    top_2_candidates = []
    allData = []

    response = requests.get(f'https://results.elections.gov.lk/district_preference.php?district={districtName}')

    html_text = response.text

    soup = BeautifulSoup(html_text, 'lxml')

    votesTable = soup.find_all('table', class_ = 'table select-table')[0]
    votesTableRow = votesTable.find_all('tr')
    numberOfCandidates = len(votesTableRow)-1

    votesCount = votesTable.find_all('p')

    for i in range(numberOfCandidates):
        votesCount = int(votesTable.find_all('p')[i].text.replace(",", ""))
        votesCountArray.append(votesCount)

    top_2 = sorted(enumerate(votesCountArray), key=lambda x: x[1], reverse=True)

    for id, count in top_2:
        top_2_ids.append(id)
        top_2_counts.append(count)

    allData.append(top_2_counts)

    candidateNames = votesTable.find_all('h6')
    for i in top_2_ids:
        top_2_candidates.append(candidateNames[i*2].text.title())

    allData.append(top_2_candidates)

    return allData



response = requests.get('https://results.elections.gov.lk/district_results.php?district=Colombo')
html_text = response.text

soup = BeautifulSoup(html_text, 'lxml')
districts = soup.find_all('span', class_ = 'menu-title')
for district in districts:
    districtName = district.text
    if districtName != "All Island":
        print(districtName)
        response = requests.get(f'https://results.elections.gov.lk/district_results.php?district={districtName}')
        districtData = getResults(response)
        response = requests.get(f'https://results.elections.gov.lk/division_results.php?district={districtName}&pd_division=Postal%20Votes')
        postalData = getResults(response)
        preferenceData = getPreferenceResults(districtName)
        data = {
                "districtName": districtName,

                "districtResult": [
                {
                    "candidateName": districtData[9][0],
                    "totalVotes": districtData[7][0]
                },
                {
                    "candidateName": districtData[9][1],
                    "totalVotes": districtData[7][1]
                },
                {
                    "candidateName": districtData[9][2],
                    "totalVotes": districtData[7][2]
                },
                {
                    "candidateName": districtData[9][3],
                    "totalVotes": districtData[7][3]
                },
                {
                    "candidateName": "Other",
                    "totalVotes": districtData[8]
                }
                ],

                "districtVotes" : [
                {
                    "validVotesCount": districtData[0],
                    "validVotesPercentage": districtData[1],
                    "rejectedVotesCount": districtData[2],
                    "rejectedVotesPercentage": districtData[3],
                    "totalPolledCount": districtData[4],
                    "totalPolledPercentage": districtData[5],
                    "totalElectorsCount": districtData[6]
                }
                ],

                "postalResult": [
                {
                    "candidateName": postalData[9][0],
                    "totalVotes": postalData[7][0]
                },
                {
                    "candidateName": postalData[9][1],
                    "totalVotes": postalData[7][1]
                },
                {
                    "candidateName": postalData[9][2],
                    "totalVotes": postalData[7][2]
                },
                {
                    "candidateName": postalData[9][3],
                    "totalVotes": postalData[7][3]
                },
                {
                    "candidateName": "Other",
                    "totalVotes": postalData[8]
                }
                ],

                "postalVotes" : [
                {
                    "validVotesCount": postalData[0],
                    "validVotesPercentage": postalData[1],
                    "rejectedVotesCount": postalData[2],
                    "rejectedVotesPercentage": postalData[3],
                    "totalPolledCount": postalData[4],
                    "totalPolledPercentage": postalData[5],
                    "totalElectorsCount": postalData[6]
                }
                ],

                "preferenceResult": [
                {
                    "candidateName": preferenceData[1][0],
                    "totalVotes": preferenceData[0][0]
                },
                {
                    "candidateName": preferenceData[1][1],
                    "totalVotes": preferenceData[0][1]
                }
                ]
            }
        wholeData.append(data)
print(wholeData)
#./../src/data/election_data.json
with open('backend/data/electioin_data.json', 'w') as json_file:
    json.dump(wholeData, json_file, indent=4)

print("JSON file created successfully!")

