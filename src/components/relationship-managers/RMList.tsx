
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApi } from '@/contexts/ApiContext';

const RMList = () => {
  const { relationshipManagers, rmClients } = useApi();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relationship Managers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Clients</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relationshipManagers.map((rm) => (
              <TableRow key={rm.id}>
                <TableCell>{rm.name}</TableCell>
                <TableCell>{rm.email}</TableCell>
                <TableCell>{rmClients[rm.id]?.length || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RMList;
