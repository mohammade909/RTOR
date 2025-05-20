const people = [
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
  ]
  
  export default function UserDashReward() {
    return (
      <div className="px-4 sm:px-6 lg:px-8 ">
        <div className="flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle ">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="text-gray-900 bg-[#ffeded]">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-lg font-semibold text-gray-900 sm:pl-0">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-lg font-semibold text-gray-900">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-lg font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-lg font-semibold text-gray-900">
                      Role
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-950 bg-pink-900/50">
                  {people?.length > 0 ? (
                  people.map((person) => (
                    <tr key={person.email}>
                      <td className="py-4 pl-4 pr-3 text-lg font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                        {person.name}
                      </td>
                      <td className="px-3 py-4 text-lg text-gray-500 whitespace-nowrap">{person.title}</td>
                      <td className="px-3 py-4 text-lg text-gray-500 whitespace-nowrap">{person.email}</td>
                      <td className="px-3 py-4 text-lg text-gray-500 whitespace-nowrap">{person.role}</td>
                      <td className="relative py-4 pl-3 pr-4 text-lg font-medium text-right whitespace-nowrap sm:pr-0">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                          Edit<span className="sr-only">, {person.name}</span>
                        </a>
                      </td>
                    </tr>
                  ))):(
                    <tr>
                      <td
                        colSpan="6"
                        className="py-4 text-lg text-center text-gray-400 bg-red-900/50"
                      >
                        No data available
                      </td>
                    </tr>
                  )
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
  