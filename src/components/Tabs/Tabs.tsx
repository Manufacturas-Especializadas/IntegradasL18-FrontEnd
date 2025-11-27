import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

interface Props {
    weeks: any[];
    selectedWeek: number | null;
    onWeekSelect: (weekNumber: number) => void;
};

function classNames(...clasess: string[]) {
    return clasess.filter(Boolean).join(' ');
};

export const Tabs = ({ weeks, selectedWeek, onWeekSelect }: Props) => {

    if (weeks.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className=" text-gray-500">
                    No hay órdenes de producción cargadas
                </p>
            </div>
        );
    };

    return (
        <div className="w-full px-2 sm:px-0">
            <TabGroup>
                <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                    {weeks.map((week) => (
                        <Tab
                            key={week.weekNumber}
                            className={({ selected }) =>
                                classNames(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 hover:cursor-pointer',
                                    selected
                                        ? 'bg-white text-blue-700 shadow'
                                        : 'text-blue-100 hover:bg-white/0.12 hover:text-white'
                                )
                            }
                            onClick={() => onWeekSelect(week.weekNumber)}
                        >
                            Semana {week.weekNumber}
                        </Tab>
                    ))}
                </TabList>
                <TabPanels className="mt-2">
                    {weeks.map((week) => (
                        <TabPanel
                            key={week.weekNumber}
                            className={classNames(
                                'rounded-xl bg-white p-3',
                                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                            )}
                        >
                        </TabPanel>
                    ))}
                </TabPanels>
            </TabGroup>
        </div>
    );
};
